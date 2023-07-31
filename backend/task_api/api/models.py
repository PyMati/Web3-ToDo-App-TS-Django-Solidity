from django.db import models

# Create your models here.
class Task(models.Model):
    wallet = models.CharField(max_length=256)
    title = models.CharField(max_length=100)
    description = models.CharField(max_length=2524)
    reward = models.CharField(max_length=100)
    done = models.BooleanField(blank = True)
