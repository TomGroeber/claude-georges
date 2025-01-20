from django.urls import path
from .views import *

urlpatterns = [
    path('', ViewNotificationsView.as_view(), name='get-notifications'),
    path('count', NotificationCountView.as_view(), name='notifications-count'),
]
