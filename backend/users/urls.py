from django.urls import path
from .views import *
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('list', UserListView.as_view(), name='user-list'),
    path('', UserDetailView.as_view(), name='user-detail'),
    path('create', UserCreateView.as_view(), name='user-create'),
    path('<int:pk>', UserDetailView.as_view(), name='user-detail'),
    path('login', LoginView.as_view(), name="user-login"),
    path('refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('change-password', ChangePasswordView.as_view()),
    path('self', SelfDetailView.as_view()),
    path('limits', GetLimitsView.as_view())
]