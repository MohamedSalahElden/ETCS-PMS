# Generated by Django 5.1.4 on 2025-01-19 15:37

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tasks", "0004_alter_task_due_date_alter_task_files"),
    ]

    operations = [
        migrations.AlterField(
            model_name="task",
            name="description",
            field=models.TextField(null=True),
        ),
    ]
