from rest_framework import serializers
from .models import Task


class TaskSerializer(serializers.Serializer):
    wallet = serializers.CharField(required = True)
    title = serializers.CharField(required = True)
    description = serializers.CharField(required = True)
    reward = serializers.CharField(required = True)
    done = serializers.BooleanField(required = True)

    def create(self, validated_data):
        print(validated_data)
        return Task.objects.create(**validated_data)