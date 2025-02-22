from django.db import models

class Events(models.Model):
    title = models.CharField(max_length=100)
    start = models.DateTimeField(unique=True)
    end = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title