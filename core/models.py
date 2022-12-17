from django.db import models

# Create your models here.
class Song(models.Model):
    name = models.CharField(max_length=80)
    artist = models.CharField(max_length=80)
    spotify_link = models.CharField(max_length=100, primary_key=True)
    youtube_link = models.CharField(max_length=100)

    def __str__(self) -> str:
        return '%s - %s'.format(self.name, self.artist)

