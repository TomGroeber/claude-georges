from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from translations.constants import get_message
from vacation_manager.settings import LANGUAGE
from vacation_manager.response_handler import ResponseHandler
from .models import Events
from django.db.models import Q
from .serializers import EventSerializer

# Create your views here.
class GetEvents(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def get(self, request):
        try:
            page_size = int(request.GET.get("page_size", 10))
            page_number = int(request.GET.get("page_number", 1))
            search_key = request.GET.get("search_key", None)
            events = Events.objects.all()

            if search_key:
                events = events.filter(Q(title__icontains=search_key))
            else:
                events = events

            events = events.order_by('-id')[(page_number - 1) * page_size : page_number * page_size]
            
            extras = {
                "total_records": events.count()
            }
            
            serializer = EventSerializer(events, many=True)
            return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "EVENT_RETRIEVED_SUCCESSFULLY"), extras=extras)
        except Exception as e:
            return self._rh.error_response(message=str(e))

    def post(self, request):
        try:
            serializer = EventSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "EVENT_CREATED_SUCCESSFULLY"))
            return self._rh.error_response(message=serializer.errors)
        except Exception as e:
            return self._rh.error_response(message=str(e))

class UpdateDeleteEvents(APIView):
    permission_classes = [IsAuthenticated]
    _rh = ResponseHandler()

    def patch(self, request, event_id):
        try:
            event = Events.objects.get(id=event_id)
            serializer = EventSerializer(event, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return self._rh.success_response(serializer.data, message=get_message(LANGUAGE, "EVENT_UPDATED_SUCCESSFULLY"))
            return self._rh.error_response(message=serializer.errors)
        except Events.DoesNotExist:
            return self._rh.error_response(message=get_message(LANGUAGE, "EVENT_NOT_FOUND"))
        except Exception as e:
            return self._rh.error_response(message=str(e))

    def delete(self, request, event_id):
        try:
            event = Events.objects.get(id=event_id)
            event.delete()
            return self._rh.success_response(message=get_message(LANGUAGE, "EVENT_DELETED_SUCCESSFULLY"))
        except Events.DoesNotExist:
            return self._rh.error_response(message=get_message(LANGUAGE, "EVENT_NOT_FOUND"))
        except Exception as e:
            return self._rh.error_response(message=str(e))