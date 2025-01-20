from django.urls import path
from .views import *

urlpatterns = [
    path('<int:event_id>', UpdateDeleteEvents.as_view(), name='event-update'), # patch, delete
    path('', GetEvents.as_view(), name='event-get'), # get
]
