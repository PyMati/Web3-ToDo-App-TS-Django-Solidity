from django.urls import path
from . import views


urlpatterns = [
    path("", views.server_status, name = "status"),
    path("api", views.task_list, name = 'task')
]
