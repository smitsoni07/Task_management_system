from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import *
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .models import Task
from rest_framework.decorators import api_view
from django.contrib.auth.hashers import check_password

# User Registration View
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')

        # Check if username exists
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

        # Create the user
        user = User.objects.create_user(username=username, password=password, email=email)

        # Generate token
        refresh = RefreshToken.for_user(user)
        return Response({
            'message': 'User registered successfully',
            'access': str(refresh.access_token),
            'refresh': str(refresh),
        }, status=status.HTTP_201_CREATED)

# User Profile View - Get and Update User Profile
class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response(serializer.data)

    def put(self, request):
        user = request.user
        data = request.data

        existing_password = data.get('existing_password')
        new_password = data.get('new_password')

        # Verify the existing password
        if existing_password and not check_password(existing_password, user.password):
            return Response({'error': 'Incorrect existing password'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = UserSerializer(user, data=data, partial=True)

        if serializer.is_valid():
            # If new_password is provided, update the user's password
            if new_password:
                user.set_password(new_password)
                user.save()

            serializer.save()
            return Response({'message': 'Profile updated successfully', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Task Management Views - List, Create, Update, Delete Tasks
class TaskListCreateView(ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(assigned_user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(assigned_user=self.request.user)

class TaskDetailView(RetrieveUpdateDestroyAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(assigned_user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        
        task = self.get_object()  # Get the task object to be deleted
        task.delete()  # Delete the task
        return Response({'message': 'Task deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
