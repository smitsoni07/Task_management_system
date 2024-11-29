from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Return minimal user data

class TaskSerializer(serializers.ModelSerializer):
    assigned_user = UserSerializer(read_only=True)  # Display assigned user, not editable

    class Meta:
        model = Task
        fields = ['id', 'title', 'description', 'is_completed', 'due_date', 'created_at', 'updated_at', 'assigned_user']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
