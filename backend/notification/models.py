from django.db import models
from timeoff.models import TimeOffRequest
from users.models import CustomUser

# Create your models here.

class Notifications(models.Model):
    title = models.CharField(max_length=50, null=False, blank=False)
    message = models.CharField(max_length=1000, null=False, blank=False)
    from_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    to_user = models.ManyToManyField(CustomUser, related_name='received_notifications')
    type = models.CharField(max_length=10, choices=(("request", "request"), ("status", "status")))
    is_read = models.BooleanField(default=False)
    leave_request = models.ForeignKey(TimeOffRequest, on_delete=models.CASCADE)