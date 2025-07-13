from rest_framework import serializers
from django.contrib.auth import get_user_model

User = get_user_model()


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name", "username", "password"]
        extra_kwargs = {
            "password": {"write_only": True, "min_length": 6},
            "first_name": {"required": True, "allow_blank": False},
            "last_name": {"required": False},
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
