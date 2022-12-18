# Generated by Django 4.1.4 on 2022-12-17 20:18

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_songs_artist_alter_songs_name_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Playlists',
            fields=[
                ('id', models.CharField(max_length=500, primary_key=True, serialize=False)),
                ('last_updated', models.DateField()),
            ],
        ),
        migrations.AddField(
            model_name='songs',
            name='playlist',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='tracks', to='core.playlists'),
        ),
    ]
