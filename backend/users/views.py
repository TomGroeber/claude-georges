from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from users.permissions import IsSiteAdmin
from django.shortcuts import get_object_or_404
from .models import CustomUser, RoleLimits
from django.contrib.auth import authenticate
from .serializers import LimitsViewSerializer, UserCreateSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from vacation_manager.response_handler import ResponseHandler
from djangorestframework_camel_case.parser import CamelCaseJSONParser
from django.db.models import Q
from translations.constants import get_message
from vacation_manager.settings import LANGUAGE

class UserListView(APIView):
    permission_classes = [IsSiteAdmin]  # Admin-only access
    _rh = ResponseHandler()

    def get(self, request):
        try:
            page_size = int(request.GET.get("page_size", 5))
            page_number = int(request.GET.get("page_number", 1))
            search_key = request.GET.get("search_key", None)
            users = CustomUser.objects.exclude(role="admin")

            if search_key:
                search_terms = search_key.split()
                if len(search_terms) == 2:
                    fname, lname = search_terms
                    users = users.filter(Q(first_name__icontains=fname) & Q(last_name__icontains=lname))
                else:
                    users = users.filter(Q(first_name__icontains=search_key) | Q(last_name__icontains=search_key))
            else:
                users = users

            users = users.order_by('-id')[(page_number - 1) * page_size : page_number * page_size]
            
            extras = {
                "total_records": users.count()
            }
            
            serializer = UserCreateSerializer(users, many=True)
            return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "USER_RETRIEVED_SUCCESSFULLY"), extras=extras)
        except Exception as e:
            return self._rh.error_response(message=str(e))

class UserCreateView(APIView):
    permission_classes = [IsSiteAdmin]
    _rh = ResponseHandler()

    def post(self, request):
        try:
            serializer = UserCreateSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "USER_CREATED_SUCCESSFULLY"))
            return self._rh.error_response(message=serializer.errors)
        except Exception as e:
            return self._rh.error_response(message=str(e))
        
class SelfDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request):
        try:
            serializer = UserCreateSerializer(request.user)
            return self._rh.success_response(data=serializer.data, message=get_message(LANGUAGE, "USER_RETRIEVED_SUCCESSFULLY"))
        except Exception as e:
            return self._rh.error_response(message=str(e))
        
class ChangePasswordView(APIView):
    permission_classes = [IsSiteAdmin]
    _rh = ResponseHandler()    

    def post(self, request):
        try:
            old_password = request.data.get("old_password")
            new_password = request.data.get("new_password")
            user = request.user

            if user.check_password(old_password):
                user.set_password(new_password)
                user.save()
                return self._rh.success_response(message=get_message(LANGUAGE, "PASSWORD_UPDATED_SUCCESSFULLY"))
            else:
                return self._rh.error_response(message=get_message(LANGUAGE, "CURRENT_PASSWORD_INCORRECT"))
            
        except Exception as e:
            return self._rh.error_response(message=str(e))

class GetLimitsView(APIView):
    permission_classes = [IsSiteAdmin]
    _rh = ResponseHandler()

    def get(self, request):
        try:
            limits = RoleLimits.objects.all()
            serializer = LimitsViewSerializer(limits, many=True)
            return self._rh.success_response(data=serializer.data, message=get_message(LANGUAGE, "FETCHED_LIMITS_SUCCESSFULLY"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))

    def patch(self, request):
        try:
            turner_limit = request.data.get("turner_limit")
            miller_limit = request.data.get("miller_limit")
            welder_limit = request.data.get("welder_limit")

            turner, turner_created = RoleLimits.objects.get_or_create(
                role="turner",
                defaults={"max_conncurent_off": float(turner_limit)}
            )
            miller, miller_created = RoleLimits.objects.get_or_create(
                role="miller",
                defaults={"max_conncurent_off": float(miller_limit)}
            )
            welder, welder_created = RoleLimits.objects.get_or_create(
                role="welder",
                defaults={"max_conncurent_off": float(welder_limit)}
            )


            if not all([turner_created,miller_created,welder_created]):
                turner.max_conncurent_off = float(turner_limit)
                miller.max_conncurent_off = float(miller_limit)
                welder.max_conncurent_off = float(welder_limit)

                turner.save()
                welder.save()
                miller.save()

            return self._rh.success_response(message=get_message(LANGUAGE, "LIMITS_UPDATED_SUCCESSFULLY"))
    
        except Exception as e:
            return self._rh.error_response(message=str(e))

class UserDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request, pk=None):
        try:
            if pk:
                user = get_object_or_404(CustomUser, pk=pk)
            else:
                user = get_object_or_404(CustomUser, id=request.user.id)
            serializer = UserCreateSerializer(user)
            return self._rh.success_response(data=serializer.data, message=get_message(LANGUAGE, "USER_RETRIEVED_SUCCESSFULLY"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))
    
    def patch(self, request, pk):
        try:
            if request.user.role == "admin":
                user = get_object_or_404(CustomUser, pk=pk)
                serializer = UserCreateSerializer(user, data=request.data, partial=True)
                if serializer.is_valid():
                    serializer.save()
                    return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "USER_UPDATED_SUCCESSFULLY"))
                return self._rh.error_response(serializer.errors, message="Failed to update user")
            return self._rh.error_response(message=get_message(LANGUAGE, "NOT_ALLOWED"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))
    
    def delete(self, request, pk):
        try:    
            if request.user.role == "admin":
                user = get_object_or_404(CustomUser, pk=pk)
                user.delete()
                return self._rh.success_response(message="User deleted successfully")
            return self._rh.error_response(message=get_message(LANGUAGE, "NOT_ALLOWED"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))

class LoginView(APIView):
    _rh = ResponseHandler()
    parser_classes = [CamelCaseJSONParser]


    def post(self, request):
        try:
            email = request.data.get('email')
            password = request.data.get('password')

            if not email or not password:
                return self._rh.error_response(message=get_message(LANGUAGE, "PROVIDE_EMAIL_AND_PASSWORD"))
            
            try:
                user = CustomUser.objects.get(email=email)   

                user = authenticate(email=email, password=password)
                if user is None:
                    return self._rh.success_response(None,code=0, message=get_message(LANGUAGE, "INVALID_PASSWORD"))

                refresh = RefreshToken.for_user(user)

                role = "admin" if user.is_superuser else getattr(user, 'role', 'user')

                data = {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                    'user_data': {
                                    'role': role,
                                    'email': user.email,
                                    'first_name': user.first_name,
                                    'last_name': user.last_name,
                                }
                }
                return self._rh.success_response(data, message=get_message(LANGUAGE, "LOGIN_SUCCESSFUL"))

            except CustomUser.DoesNotExist:
                return self._rh.error_response(message=get_message(LANGUAGE, "USER_NOT_EXIST"))
        
        except Exception as e:
            return self._rh.error_response(message=str(e))