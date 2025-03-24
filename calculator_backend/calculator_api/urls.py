# calculator_api/urls.py
from django.urls import path
from .views import generate_code

urlpatterns = [
    path('generate-code/', generate_code, name='generate_code'),
    
]