# Generated by Django 4.1.4 on 2022-12-22 18:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0007_alter_songs_artist"),
    ]

    operations = [
        migrations.AddField(
            model_name="artists",
            name="followers",
            field=models.IntegerField(default=True, null=True),
        ),
    ]
