import pytest
from rest_framework import status
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model

from ..models import Task

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def user1(api_client):
    data = {
        "first_name": "Jack",
        "username": "jsparrow",
        "password": "jsparrow123",
    }

    response = api_client.post("/users/register/", data, format="json")
    assert response.status_code == status.HTTP_201_CREATED

    user = User.objects.get(username=data["username"])
    user.raw_password = data["password"]
    return user


@pytest.fixture
def user2(api_client):
    data = {
        "first_name": "Jane",
        "last_name": "Doe",
        "username": "janedoe",
        "password": "securepass123",
    }

    response = api_client.post("/users/register/", data, format="json")
    assert response.status_code == status.HTTP_201_CREATED

    user = User.objects.get(username=data["username"])
    user.raw_password = data["password"]
    return user


@pytest.fixture
def token1(api_client, user1):
    response = api_client.post(
        "/api/token/",
        {"username": user1.username, "password": user1.raw_password},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    return response.data["access"]


@pytest.fixture
def token2(api_client, user2):
    response = api_client.post(
        "/api/token/",
        {"username": user2.username, "password": user2.raw_password},
        format="json",
    )

    assert response.status_code == status.HTTP_200_OK
    return response.data["access"]


@pytest.fixture
def task1(user1):
    return Task.objects.create(
        title="Task 1", description="Test", status="New", user_id=user1
    )


@pytest.fixture
def task2(user1):
    return Task.objects.create(
        title="Task 2", description="Test", status="Completed", user_id=user1
    )


@pytest.fixture
def task3(user2):
    return Task.objects.create(
        title="Task 3", description="Test", status="New", user_id=user2
    )


@pytest.fixture
def task4(user2):
    return Task.objects.create(
        title="Task 4", description="Test", status="In Progress", user_id=user2
    )
