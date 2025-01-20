from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from translations.constants import get_message
from notification.models import Notifications
from vacation_manager.response_handler import ResponseHandler
from notification.serializers import NotificationSerializer
from vacation_manager.settings import LANGUAGE

# Create your views here.

class ViewNotificationsView(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request):
        try:
            page_size = int(request.GET.get("page_size", 5))
            page_number = int(request.GET.get("page_number", 1))
            # search_key = request.GET.get("search_key", None)

            notifications = Notifications.objects.filter(to_user=request.user).order_by("-id")
            serializer = NotificationSerializer(notifications[(page_number - 1) * page_size : page_number * page_size], many=True)
            notifications.update(is_read=True)
            extras = {
                    "total_records": notifications.count()
                }
            
            return self._rh.success_response(data=serializer.data, message=get_message(LANGUAGE, "FETCH_NOTIFICATIONS_SUCCESS"), extras=extras)
        except Exception as e:
            return self._rh.error_response(message=str(e))
    
    def delete(self, request):
        try:
            notificaiton_id = request.GET.get("id", None)

            if not notificaiton_id:
                notificaiton = Notifications.objects.filter(to_user=request.user)
            else:
                notificaiton = Notifications.objects.filter(id=int(notificaiton_id))
            
            notificaiton.delete()
            
            return self._rh.success_response(data=None, message=get_message(LANGUAGE, "DELETE_NOTIFICATION_SUCCESS"))
        except Exception as e:
            return self._rh.error_response(message=str(e))

        
class NotificationCountView(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request):
        try:
            notifications = Notifications.objects.filter(to_user=request.user, is_read=False).order_by("-id")
            
            return self._rh.success_response(data=notifications.count(), message=get_message(LANGUAGE, "FETCH_NOTIFICATIONS_SUCCESS"))
        except Exception as e:
            return self._rh.error_response(message=str(e))