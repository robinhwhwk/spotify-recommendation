# Generated by Django 4.1.4 on 2022-12-22 18:25

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0006_artists_id_songs_id_alter_artists_spotify_link_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="songs",
            name="artist",
            field=models.CharField(blank=True, default=None, max_length=500, null=True),
        ),
    ]
