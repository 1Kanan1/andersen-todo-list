import pytest
from rest_framework import status
from django.contrib.auth import get_user_model

User = get_user_model()


@pytest.mark.django_db
@pytest.mark.parametrize(
    "account",
    [
        {
            "first_name": "Jane",
            "last_name": "Doe",
            "username": "jdoe",
            "password": "jdoe123",
        },
        {
            "first_name": "Jack",
            "last_name": "Sparrow",
            "username": "jsparrow",
            "password": "jsparrow123",
        },
    ],
)
def test_register_user_success(api_client, account):
    """Test successful user registration"""

    response = api_client.post("/users/register/", account, format="json")
    assert response.status_code == status.HTTP_201_CREATED

    user = User.objects.get(username=account["username"])
    assert user.first_name == account["first_name"]
    assert user.last_name == account["last_name"]
    assert user.check_password(account["password"])


@pytest.mark.django_db
@pytest.mark.parametrize(
    "invalid_data,missing_field",
    [
        ({"username": "jdoe", "password": "jdoe123"}, "first_name"),
        ({"first_name": "Jane", "password": "jdoe123"}, "username"),
        ({"first_name": "Jane", "username": "jdoe"}, "password"),
    ],
)
def test_register_user_missing_required_fields(api_client, invalid_data, missing_field):
    """Test registering user with missing required fields"""

    response = api_client.post("/users/register/", invalid_data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert missing_field in response.data  # missing_field contains Error message
    assert User.objects.count() == 0


@pytest.mark.django_db
def test_register_user_short_password(api_client):
    """Test registration fails with password < 6 characters"""

    data = {
        "first_name": "Jane",
        "username": "janedoe",
        "password": "short",
    }

    response = api_client.post("/users/register/", data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "password" in response.data
    assert User.objects.count() == 0


@pytest.mark.django_db
def test_register_user_duplicate_username(api_client):
    """Test registration fails with duplicate username"""

    data = {
        "first_name": "Admin",
        "username": "admin",
        "password": "admin123",
    }

    api_client.post("/users/register/", data, format="json")
    response = api_client.post("/users/register/", data, format="json")
    assert response.status_code == status.HTTP_400_BAD_REQUEST
    assert "username" in response.data
    assert User.objects.count() == 1
