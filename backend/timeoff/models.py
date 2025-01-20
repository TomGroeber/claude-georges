from django.db import models
from django.conf import settings
from datetime import datetime, time, timedelta
import holidays

from translations.constants import get_message
from vacation_manager.settings import LANGUAGE

from events.models import Events 

holidays_dict = dict()

def get_holidays(year):
    global holidays_dict
    try:
        return holidays_dict[year]
    except KeyError:
        holidays_dict.update({year:holidays.country_holidays('DE', years=year, language='de')})
        return holidays_dict[year]
    
def time_to_seconds(t):
    return t.hour * 3600 + t.minute * 60 + t.second

class TimeOffRequest(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='time_off_requests')
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    reason = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    total_days = models.DecimalField(max_digits=5, decimal_places=3)
    comment = models.CharField(max_length=100, null=True, blank=True)

    def is_weekend(self, date):
        """Check if the given date is a weekend."""
        return date.weekday() in [5, 6]
    
    def is_event_day(self, date: datetime):
        events = Events.objects.filter(start__lte=date, end__gte=date)
        return events.exists()

    def calculate_days(self):
        """Calculate the total hours for the request, considering weekends and events."""
        work_start = time(7, 30)
        work_end = time(16, 0)
        lunch_start = time(12, 0)
        lunch_end = time(12, 30)

        if self.start_date.time() < work_start:
            self.start_date = datetime(self.start_date.year, self.start_date.month, self.start_date.day, 7, 30)

        if self.end_date.time() > work_end or self.end_date.time() == time(0, 0):
            self.end_date = datetime(self.end_date.year, self.end_date.month, self.end_date.day, 16, 0)

        if (self.start_date.date() == self.end_date.date()):
            if self.start_date.time() >= work_start and self.end_date.time() <= work_end:
                if self.start_date.time() < self.end_date.time():
                    duration = self.end_date - self.start_date
                    if self.start_date.time() <= lunch_start and self.end_date.time() > lunch_end:
                        duration = duration - timedelta(minutes=30)
                return duration.total_seconds() / 28800
            
        elif self.end_date.date() > self.start_date.date():
            total_duration = timedelta(0)
            current_date = self.start_date.date()
            
            if self.start_date.time() >= work_start:
                if self.start_date.time() < lunch_start:
                    start_time_to_end = timedelta(hours=work_end.hour, minutes=work_end.minute) - timedelta(hours=self.start_date.time().hour, minutes=self.start_date.time().minute)
                    total_duration += start_time_to_end - timedelta(minutes=30)
                else:
                    start_time_to_end = timedelta(hours=work_end.hour, minutes=work_end.minute) - timedelta(hours=self.start_date.time().hour, minutes=self.start_date.time().minute)
                    total_duration += start_time_to_end
            else:
                return get_message(LANGUAGE, 'WORKING_TIME_ERROR')

            while current_date < self.end_date.date():
                if not self.is_weekend(current_date) and not self.is_event_day(current_date):
                    total_duration += timedelta(days=1)
                current_date += timedelta(days=1)

            if current_date == self.end_date.date() and self.end_date.time() < work_end:
                total_duration -= timedelta(days=1)
                if self.end_date.time() >= work_start:
                    if self.end_date.time() <= lunch_start:
                        total_duration += timedelta(seconds=(time_to_seconds(self.end_date.time()) - time_to_seconds(work_start)))
                    else:
                        total_duration += timedelta(seconds=(time_to_seconds(self.end_date.time()) - time_to_seconds(work_start))) - timedelta(minutes=30)

            return round(total_duration.days + (total_duration.seconds / 28800), 3)
        
        return None
    
    def save(self, **kwargs):
        self.total_days = self.calculate_days()
        super().save(**kwargs)