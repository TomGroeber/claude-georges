from decimal import Decimal
from django.core.management.base import BaseCommand
from datetime import datetime, timedelta
from users.models import CustomUser

class Command(BaseCommand):
    help = "Custom task to clean up old records or perform periodic actions."

    def handle(self, *args, **kwargs):
        try:
            self.stdout.write("INSIDE CRONJOB")
            ROLES = ['turner', 'miller', 'welder', 'admin']
            users = CustomUser.objects.filter(role__in=ROLES)
            for user in users:
                user.allowed_leaves += Decimal('2.7')
                user.save()
            self.stdout.write(f"Updated allowed_leaves for {users.count()} users.")
        except Exception as e:
            self.stdout.write(f"Error: {e}")
        