from django.contrib import admin

from .models import Task


@admin.register(Task)
class UserAdmin(admin.ModelAdmin):
    list_display = ["title", "description", "status", "user_id"]
