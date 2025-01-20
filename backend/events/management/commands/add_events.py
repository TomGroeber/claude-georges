from django.core.management.base import BaseCommand
from events.models import Events
from timeoff.models import get_holidays
from datetime import datetime
import logging

class Command(BaseCommand):
    help = 'Populate holidays for given years'

    def handle(self, *args, **kwargs):
        current_year = datetime.now().year

        holidays = get_holidays(current_year)
        for date, name in holidays.items():
            Events.objects.get_or_create(
                start=date,
                end=date,
                title=name,
            )
        self.stdout.write(f'Successfully populated holidays for year {current_year}')