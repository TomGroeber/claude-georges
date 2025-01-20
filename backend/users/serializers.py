from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import CustomUser, RoleLimits
from django.db.models import Sum
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'role']

class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    used_leaves = serializers.DecimalField(max_digits=5, decimal_places=3, read_only=True)
    available_leaves = serializers.DecimalField(max_digits=5, decimal_places=3, read_only=True)

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'passport', 'allowed_leaves', 'role', 'first_name', 'last_name', 'used_leaves', 'available_leaves', 'password']

    def update(self, instance, validated_data):
        password = validated_data.get('password', None)
        if password:
            validated_data['password'] = make_password(password)

        return super().update(instance, validated_data)

    def create(self, validated_data):
        user = CustomUser.objects.create(
            email=validated_data['email'],
            password=make_password(validated_data['password']),
            passport=validated_data.get('passport'),
            allowed_leaves=validated_data.get('allowed_leaves'),
            role=validated_data.get('role'),
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user
    
    def _get_display_role(self, instance):
        mapping = {
            'turner': 'Tourneur',
            'miller': 'Fraiseur',
            'welder': 'Soudeur',
            'admin': 'Admin'
        }
        return mapping[instance.role]
    def to_representation(self, instance):
        representation = super().to_representation(instance)

        # Calculate or fetch the values for used_leaves and available_leaves
        used_leaves = Decimal(instance.time_off_requests.filter(status="approved").aggregate(Sum('total_days'))['total_days__sum'] or 0.0)
        available_leaves = Decimal(instance.allowed_leaves - used_leaves)
        
        # Add them to the response
        representation['used_leaves'] = used_leaves
        representation['available_leaves'] = available_leaves
        representation['role'] = self._get_display_role(instance)

        return representation
    
class LimitsViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoleLimits
        fields = ["role", "max_conncurent_off"]