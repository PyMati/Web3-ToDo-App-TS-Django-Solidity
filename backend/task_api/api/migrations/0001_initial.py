# Generated by Django 4.2.3 on 2023-07-29 15:31

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('wallet', models.CharField(max_length=256)),
                ('title', models.CharField(max_length=100)),
                ('description', models.CharField(max_length=2524)),
                ('reward', models.CharField(max_length=100)),
                ('done', models.BooleanField()),
            ],
        ),
    ]
