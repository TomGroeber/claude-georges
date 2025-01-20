from rest_framework.serializers import ModelSerializer
from users.serializers import UserSerializer
from timeoff.serializers import TimeOffRequestSerializer
from notification.models import Notifications

class NotificationSerializer(ModelSerializer):
    class Meta:
        model = Notifications
        fields = "__all__"
    
    def to_representation(self, obj):
       self.fields['from_user'] = UserSerializer(obj.from_user)
       self.fields['leave_request'] = TimeOffRequestSerializer(obj.leave_request)
       return super().to_representation(obj)