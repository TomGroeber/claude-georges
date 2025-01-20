#!/bin/bash

export PYTHONUNBUFFERED=1

service cron start


python manage.py makemigrations users timeoff notification events
python manage.py migrate

python manage.py add_events

python manage.py shell -c "
from users.models import CustomUser;
if not CustomUser.objects.filter(email='adminuser@default.com').exists():
    CustomUser.objects.create_superuser(email='adminuser@default.com', password='adminpass')
"

python manage.py runserver 0.0.0.0:8000
