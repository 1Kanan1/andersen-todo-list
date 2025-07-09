from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from django_filters.rest_framework import DjangoFilterBackend

from .models import Task
from .permissions import IsOwner
from .serializers import TaskSerializer


class TaskListCreateView(generics.ListCreateAPIView):
    """
    GET     /tasks/                       –> List all tasks (paginated)
    GET     /tasks/?status=New            –> Filter tasks by status
    POST    /tasks/                       –> Create a task (user = request.user)
    """

    serializer_class = TaskSerializer
    filterset_fields = ["status"]
    filter_backends = [DjangoFilterBackend]
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Task.objects.filter(user_id=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user_id=self.request.user)


class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    """
    GET     /tasks/<int:pk>/              –> Retrieve specific task
    PUT     /tasks/<int:pk>/              –> Update task (owner-only)
    DELETE  /tasks/<int:pk>/              –> Delete task (owner-only)
    """

    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    # Allow for partial updates for PUT (e.g., {"status": 'Completed'})
    def put(self, request, *args, **kwargs):
        return self.partial_update(request, *args, **kwargs)
