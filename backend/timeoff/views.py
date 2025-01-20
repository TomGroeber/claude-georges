from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from translations.constants import get_message
from users.permissions import IsSiteAdmin
from notification.serializers import NotificationSerializer
from notification.models import Notifications
from users.models import CustomUser, RoleLimits
from .models import TimeOffRequest
from datetime import datetime
from .serializers import TimeOffRequestSerializer, TimeOffRequestApprovalSerializer
from vacation_manager.response_handler import ResponseHandler
from django.db.models import Sum
from django.db.models import Q
from vacation_manager.settings import LANGUAGE
from events.models import Events


class TimeOffRequestListsView(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request):
        try:
            page_size = int(request.GET.get("page_size", 5))
            page_number = int(request.GET.get("page_number", 1))

            if request.user.role == 'admin':
                requests = TimeOffRequest.objects.all().order_by("-id")
            else:
                requests = TimeOffRequest.objects.filter(user=request.user).order_by("-id")

            serializer = TimeOffRequestSerializer(requests[(page_number - 1) * page_size : page_number * page_size], many=True)
            extras = {
                        "total_records": requests.count()
                    }
            def flatten(data: dict):
                data['name'] = data['user']['first_name'] + ' ' + data['user']['last_name']
                data['role'] = data['user']['role']
                return data

            final_data = [flatten(d) for d in serializer.data]
                
            return self._rh.success_response(data=final_data, message=get_message(LANGUAGE, "FETCH_NOTIFICATION_SUCCESS"), extras=extras)
        except Exception as e:
            return self._rh.error_response(message=str(e))

class TimeOffRequestListCreateView(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def get_date_range(self, month, year):
        if month == 1:
            start_month, start_year = 12, year - 1
            end_month, end_year = 2, year
        elif month == 12:
            start_month, start_year = 11, year
            end_month, end_year = 1, year + 1
        else:
            start_month = month - 1
            end_month = month + 1
            start_year = end_year = year
        
        return start_month, start_year, end_month, end_year

    def get(self, request):
        try:
            today = datetime.now()
            month = int(request.GET.get("month", today.month))
            year = int(request.GET.get("year", today.year))
            
            start_month, start_year, end_month, end_year = self.get_date_range(month, year)

            # Collect holidays from all relevant years
            holidays = {}
            years_to_check = set([start_year, year, end_year])
            
            events = Events.objects.filter(start__year__in=years_to_check)
            for event in events:
                holidays[event.title] = {
                    "start": event.start,
                    "end": event.end,
                }
            

            # Filter holidays with fixed logic
            filtered_holidays = [
                {"start": holiday["start"],
                "end": holiday["end"],
                "title": name}
                for name, holiday in holidays.items()
                if (
                    (month == 1 and (
                        (holiday["start"].year == start_year and holiday["start"].month == start_month) or
                        (holiday["start"].year == year and holiday["start"].month <= end_month)
                    )) or
                    (month == 12 and (
                        (holiday["start"].year == year and holiday["start"].month >= start_month) or 
                        (holiday["start"].year == end_year and holiday["start"].month == end_month)
                    )) or
                    (month not in [1, 12] and 
                    holiday["start"].year == year and 
                    start_month <= holiday["start"].month <= end_month)
                )
            ]
            
            if request.user.role == 'admin':
                requests = TimeOffRequest.objects.filter(start_date__month=month,
                                                        end_date__month=month,
                                                        start_date__year=year,
                                                        end_date__year=year)
            else:
                requests = TimeOffRequest.objects.filter(user=request.user,
                                                        start_date__month=month,
                                                        end_date__month=month,
                                                        start_date__year=year,
                                                        end_date__year=year)

            requests = requests.order_by('-id')
            serializer = TimeOffRequestSerializer(requests, many=True)
            
            def flatten(data: dict):
                data['name'] = data['user']['first_name'] + ' ' + data['user']['last_name']
                data['role'] = data['user']['role']
                data['start'] = data['start_date']
                data['end'] = data['end_date']
                if request.user.role == "admin": 
                    data['title'] = data['user']['first_name'] + ' ' + data['user']['last_name']
                else:
                    data['title'] = f"""{data['reason']}""" 
                for key in ['user','start_date', 'end_date', 'reason']:
                    del data[key]
                return data

            final_data = [flatten(d) for d in serializer.data]

            return self._rh.success_response(data=filtered_holidays+ final_data)
        
        except Exception as e:
            return self._rh.error_response(message=str(e))
    
    def post(self, request):
        try:
            if request.user.role == 'admin':
                return self._rh.error_response(message=get_message(LANGUAGE, "NOT_ALLOWED"))
            
            user = request.user
            data = request.data.copy()
            data['user'] = user.id

            serializer = TimeOffRequestSerializer(data=data)
            if serializer.is_valid():
                user = request.user
                start_date = serializer.validated_data['start_date']
                end_date = serializer.validated_data['end_date']
                leave_days = serializer.validated_data['total_days']

                overlapping_requests = TimeOffRequest.objects.filter(
                        user=user,
                        status__in=['approved', 'pending'],
                        start_date__lte=data['end_date'],
                        end_date__gte=data['start_date']
                    )
                
                for request in overlapping_requests:
                        if self.time_overlap(start_date, end_date, request):
                            return self._rh.error_response(message=get_message(LANGUAGE, "LEAVE_REQUEST_OVERLAPPING"))
                
                used_leaves = TimeOffRequest.objects.filter(user=user, status__in=['approved', 'pending']).aggregate(Sum('total_days'))['total_days__sum'] or 0
                available_leaves = user.allowed_leaves - used_leaves

                if available_leaves < leave_days:
                    return self._rh.error_response(message=get_message(LANGUAGE, "INSUFFICIENT_LEAVE_BALANCE"))

                saved_obj = serializer.save()
                admins = CustomUser.objects.filter(role="admin")

                notification_obj = Notifications.objects.create(
                                                title = get_message(LANGUAGE, "LEAVE_REQ_TITLE"),
                                                message=get_message(LANGUAGE, "LEAVE_REQUEST").format(user.first_name, user.last_name),
                                                from_user = user,
                                                type = "request",
                                                leave_request = saved_obj
                                                    )
                notification_obj.to_user.set(admins)
                return self._rh.success_response(data=serializer.data, message=get_message(LANGUAGE, "LEAVE_REQUEST_SENT"))
            try:
                return self._rh.error_response(message=serializer.errors['detail'][0])
            except KeyError:
                return self._rh.error_response(data=serializer.errors, message=get_message(LANGUAGE, "ERROR_OCCURRED"))

        except Exception as e:
            return self._rh.error_response(message=str(e))
            
    def time_overlap(self, new_start_date, new_end_date, existing_request):
        existing_start_date = existing_request.start_date
        existing_end_date = existing_request.end_date

        if new_start_date < existing_end_date and new_end_date > existing_start_date:
            return True
        return False


class TimeOffRequestDetailView(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request, pk):
        try:
            time_off_request = get_object_or_404(TimeOffRequest, pk=pk)
            if request.user != time_off_request.user and request.user.role != 'admin':
                return self._rh.error_response(message=get_message(LANGUAGE, "NOT_ALLOWED"))
            serializer = TimeOffRequestSerializer(time_off_request)
            return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "DETAILS_FETCHED_SUCCESSFULLY"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))

    def delete(self, request, pk):
        try:
            time_off_request = get_object_or_404(TimeOffRequest, pk=pk)
            if time_off_request.status != 'pending':
                return self._rh.error_response(message=get_message(LANGUAGE, "LEAVE_NOT_PENDING"))
            if request.user != time_off_request.user and request.user.role != 'admin':
                return self._rh.error_response(message=get_message(LANGUAGE, "NOT_ALLOWED"))
            time_off_request.delete()
            return self._rh.success_response(data=None, message=get_message(LANGUAGE, "TIME_OFF_REQUEST_DELETED"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))


class TimeOffApprovalView(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def _check_concurrent_leaves(self, time_off_request):
        requesting_user = time_off_request.user
        role_limit = RoleLimits.objects.filter(role=requesting_user.role).first()
        
        if not role_limit:
            return True, None
            
        start_date = time_off_request.start_date
        end_date = time_off_request.end_date
        
        overlapping_requests = TimeOffRequest.objects.filter(
            status='approved',
            user__role=requesting_user.role,
            start_date__lte=end_date,
            end_date__gte=start_date
        ).select_related('user')

        
        concurrent_users = set(request.user.id for request in overlapping_requests)
        concurrent_count = len(concurrent_users) + 1
        
        if concurrent_count > role_limit.max_conncurent_off:
            warning_msg = get_message(LANGUAGE, "WARNING_CONCURRENT_LEAVES").format(concurrent_count, requesting_user.role, role_limit.max_conncurent_off)
            return False, warning_msg
            
        return True, None

    def patch(self, request, pk):
        try:
            if request.user.role != 'admin':
                return self._rh.error_response(message=get_message(LANGUAGE, "NOT_AUTHORIZED"))
            
            skip_warning = request.data.get("skip_warning", False)
            time_off_request = get_object_or_404(TimeOffRequest, pk=pk)
            user = request.user
            
            if time_off_request.status != 'pending':
                return self._rh.error_response(message=get_message(LANGUAGE, "CANNOT_UPDATE_NON_PENDING_REQUEST"))

            if request.data.get('status') == 'approved':
                if not skip_warning:
                    is_allowed, warning_message = self._check_concurrent_leaves(time_off_request)
                    if not is_allowed:
                        return self._rh.success_response(data=None, code=2, message=warning_message)

            serializer = TimeOffRequestApprovalSerializer(instance=time_off_request, data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                validated_data = serializer.validated_data
                status_key = request.data['status'].upper()
                status_value = get_message(LANGUAGE, status_key)
                if validated_data['start_date'] and validated_data['end_date']:
                    notification_obj = Notifications.objects.create(
                            title=get_message(LANGUAGE, "UPDATE_TIMEOFF_REQUEST"),
                            message=get_message(LANGUAGE, "LEAVE_UPDATE_NOTIFY").format(time_off_request.start_date, time_off_request.end_date),
                            from_user=request.user,
                            type="update",
                            leave_request=time_off_request
                        )
                else:
                    notification_obj = Notifications.objects.create(
                        title=get_message(LANGUAGE, "LEAVE_REQ_TITLE") + status_value,
                        message=f"{user.first_name} {user.last_name} {status_value} " + get_message(LANGUAGE, "REST_REQUEST"),
                        from_user=user,
                        type="status",
                        leave_request=time_off_request
                    )

                notification_obj.to_user.set([time_off_request.user])
                return self._rh.success_response(data=serializer.data, message=get_message(LANGUAGE, "REQUEST_UPDATED_SUCCESSFULLY"))
            
            return self._rh.error_response(data=serializer.errors, message=get_message(LANGUAGE, "FAILED_REQUEST_UPDATE"))
            
        except Exception as e:
            return self._rh.error_response(message=str(e))