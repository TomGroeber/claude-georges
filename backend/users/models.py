from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("The Email field must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')

        if extra_fields.get('is_staff') is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get('is_superuser') is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self.create_user(email, password, **extra_fields)


ROLE_CHOICES = [
    ('turner', 'Turner'),
    ('miller', 'Miller'),
    ('welder', 'Welder'),
    ('admin', 'Admin')
]

class CustomUser(AbstractUser):
    passport = models.CharField(max_length=50, blank=True, null=True)
    allowed_leaves = models.DecimalField(max_digits=5, decimal_places=3, default=2.7)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES)
    username = None
    email = models.EmailField(unique=True)

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username

    
class RoleLimits(models.Model):
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, unique=True)
    max_conncurent_off = models.DecimalField(max_digits=4, decimal_places=1, null=False)