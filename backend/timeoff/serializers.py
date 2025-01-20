from rest_framework import serializers

from translations.constants import get_message
from vacation_manager.settings import LANGUAGE
from .models import TimeOffRequest
from users.serializers import UserSerializer
from django.db.models import Sum

class TimeOffRequestSerializer(serializers.ModelSerializer):
    non_field_errors_key = "detail"
    class Meta:
        model = TimeOffRequest
        fields = ['id', 'user', 'start_date', 'end_date', 'reason', 'status', 'created_at']
        read_only_fields = ['status', 'created_at']

    def to_representation(self, obj):
       self.fields['user'] = UserSerializer(obj.user)
       return super().to_representation(obj)
    
    
    def validate(self, data):
        start_date = data.get('start_date')
        end_date = data.get('end_date')

        if not start_date or not end_date:
            raise serializers.ValidationError({
                self.non_field_errors_key: get_message(LANGUAGE, 'BOTH_DATES_REQUIRED')
            })

        time_off_request = TimeOffRequest(start_date=start_date, end_date=end_date)

        if time_off_request.is_weekend(start_date) or time_off_request.is_weekend(end_date):
            raise serializers.ValidationError({
                    self.non_field_errors_key: get_message(LANGUAGE, 'WEEKEND_REQUEST')
                })

        if time_off_request.is_event_day(start_date) or time_off_request.is_event_day(end_date):
            raise serializers.ValidationError({
                    self.non_field_errors_key: get_message(LANGUAGE, 'EVENT_DAY_REQUEST')
                })
        
        leave_days = time_off_request.calculate_days()

        if isinstance(leave_days, str):
            raise serializers.ValidationError({
                self.non_field_errors_key: leave_days
            })

        data['total_days'] = leave_days

        if leave_days is None:
            raise serializers.ValidationError({
                self.non_field_errors_key: "Please Apply for Time Off in within Working Hours"
            })
        
        elif leave_days < 0.0:
            raise serializers.ValidationError({
                    self.non_field_errors_key: "The end date cannot be earlier than the start date. Please adjust the dates accordingly."
                })
        
        elif leave_days == 0.0:
            raise serializers.ValidationError({
                    self.non_field_errors_key: "The end date cannot be same as start date. Please adjust the dates accordingly."
                })

        return data

class TimeOffRequestApprovalSerializer(serializers.ModelSerializer):
    non_field_errors_key = "detail"
    class Meta:
        model = TimeOffRequest
        fields = ['start_date', 'end_date', 'status', 'comment']
        extra_kwargs = {
            'status': {'required': True}
        }

    def update(self, instance, validated_data):
        instance.start_date = validated_data.get('start_date', instance.start_date)
        instance.end_date = validated_data.get('end_date', instance.end_date)

        if instance.start_date or instance.end_date:
            updated_days = instance.calculate_days()
            used_leaves = TimeOffRequest.objects.filter(user=instance.user, status__in=['approved', 'pending']).aggregate(Sum('total_days'))['total_days__sum'] or 0
            available_leaves = instance.user.allowed_leaves - used_leaves
            if available_leaves < updated_days:
                print("VALLIDATION RAISED")
                raise serializers.ValidationError("Insufficient Leave Balance")
            instance.total_days = instance.calculate_days()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
