import pytest
from rest_framework import status

from ..models import Task


@pytest.mark.django_db
def test_create_task_success(api_client, token1):
    """Test creating a task for authenticated user"""

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token1}")

    data = {
        "title": "New Task",
        "description": "Description",
        "status": "New",
    }

    response = api_client.post("/tasks/", data, format="json")
    assert response.status_code == status.HTTP_201_CREATED
    assert Task.objects.count() == 1

    task = Task.objects.get(title="New Task")
    assert task.user_id.username == "jsparrow"


@pytest.mark.django_db
def test_create_task_unauthenticated(api_client):
    """Test creating a task fails for unauthenticated user"""

    data = {"title": "New Task", "description": "Description", "status": "New"}

    response = api_client.post("/tasks/", data, format="json")
    assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
def test_retrieve_task_owner(api_client, token1, task1):
    """Test retrieving a task owned by the user"""

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token1}")

    response = api_client.get(f"/tasks/{task1.id}/")
    assert response.status_code == status.HTTP_200_OK
    assert response.data["title"] == "Task 1"


@pytest.mark.django_db
def test_retrieve_task_non_owner(api_client, token1, task3):
    """Test retrieving a task not owned by the user fails"""

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token1}")

    response = api_client.get(f"/tasks/{task3.id}/")
    assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
def test_mark_task_completed(api_client, token1, task1):
    """Test marking a task as completed"""

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token1}")

    response = api_client.put(
        f"/tasks/{task1.id}/", {"status": "Completed"}, format="json"
    )
    assert response.status_code == status.HTTP_200_OK

    task1.refresh_from_db()
    assert task1.status == "Completed"


@pytest.mark.django_db
def test_filter_task_status(api_client, token2, task3, task4):
    """Test filtering tasks by status"""

    # response.data = {
    #     "count": 1,
    #     "next": null,
    #     "previous": null,
    #     "results": [
    #         {
    #             "id": 1,
    #             "title": "Test3",
    #             "description": "Test",
    #             "status": "New",
    #             "user_id": 2
    #         },
    #         ...
    #     ]
    # }

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token2}")

    response_in_progress = api_client.get("/tasks/?status=In%20Progress")
    assert response_in_progress.status_code == status.HTTP_200_OK
    assert response_in_progress.data["count"] == 1

    response_new = api_client.get("/tasks/?status=New")
    assert response_new.status_code == status.HTTP_200_OK
    assert response_new.data["count"] == 1

    response_completed = api_client.get("/tasks/?status=Completed")
    assert response_completed.status_code == status.HTTP_200_OK
    assert response_completed.data["count"] == 0


@pytest.mark.django_db
@pytest.mark.parametrize("page", [_ for _ in range(1, 4)])
def test_tasks_pagination(api_client, token1, pagination, page):
    """Test tasks pagination"""

    api_client.credentials(HTTP_AUTHORIZATION=f"Bearer {token1}")

    response = api_client.get(f"/tasks/?page={page}")
    assert response.status_code == status.HTTP_200_OK
    assert len(response.data["results"]) <= 10
