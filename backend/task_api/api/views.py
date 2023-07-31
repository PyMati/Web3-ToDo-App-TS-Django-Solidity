from django.shortcuts import render
from django.views.decorators.csrf import csrf_protect
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.decorators import api_view
from .models import Task
from .serializers import TaskSerializer


def server_status(request):
    return HttpResponse("Up and running...")

@csrf_protect
@api_view(['GET','POST'])
def task_list(request):
    if request.method == "GET":
        tasks = Task.objects.all().filter(wallet = request.query_params['wallet'].replace('"', ""))
        serializer = TaskSerializer(tasks, many = True)
        response_array = []
        for item in range(len(serializer.data)):
            response = {  
                'done': serializer.data[item]['done'],
                'title': serializer.data[item]['title'],
                'description': serializer.data[item]['description'],
                'reward': serializer.data[item]['reward'],
            }
            response_array.append(response)
        response_data = {
            'data': response_array
        }
        return JsonResponse(response_data, safe = False)
    if request.method == "POST":
        data = JSONParser().parse(request.stream)
        is_error = False
        wallet = data['data'][1]
        tasks = Task.objects.all().filter(wallet = wallet)
        for tsk in tasks:
            tsk.delete()
        for tsk in data['data'][0]:
            new_task_to_database = {
                'wallet': wallet,
                'title': tsk['title'],
                'description': tsk['description'],
                'reward': tsk['reward'],
                'done': tsk['done']
            }
            serializer = TaskSerializer(data = new_task_to_database)
            if serializer.is_valid():
                serializer.save()
            else:
                is_error = True
        if not is_error:
            return JsonResponse("Data was successfully saved.", status = 201, safe = False)
        return JsonResponse(serializer.errors, status = 400)