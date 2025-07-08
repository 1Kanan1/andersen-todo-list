from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class Task(models.Model):
    STATUS_CHOICES = {
        "New": "New",
        "In Progress": "In Progress",
        "Completed": "Completed",
    }

    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="New")
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)

    def __str__(self):
        return self.title
