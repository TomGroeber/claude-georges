from django.urls import path
from .views import *

urlpatterns = [
    path('', TimeOffRequestListCreateView.as_view(), name='time-off-list-create'),
    path('list', TimeOffRequestListsView.as_view(), name='time-off-list'),
    path('<int:pk>', TimeOffRequestDetailView.as_view(), name='time-off-detail'),
    path('<int:pk>/approval', TimeOffApprovalView.as_view(), name='time-off-approval'),
]
