FROM python:3.10-slim

RUN apt-get update && apt-get install -y cron && apt-get clean

WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

COPY add_leaves /etc/cron.d/add_leaves

RUN chmod 0644 /etc/cron.d/add_leaves

RUN crontab /etc/cron.d/add_leaves

RUN touch /var/log/cron.log

EXPOSE 8000

COPY entrypoint.sh /app/entrypoint.sh

RUN chmod +x /app/entrypoint.sh