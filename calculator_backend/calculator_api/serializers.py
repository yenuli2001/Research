from rest_framework import serializers
from .models import GeneratedCode


class GenereatedCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = GeneratedCode
        fields = '__all__'