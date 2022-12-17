from django.db import models

# Create your models here.
class Songs(models.Model):
    name = models.CharField(max_length=500)
    artist = models.CharField(max_length=500)
    spotify_link = models.CharField(max_length=500, primary_key=True)
    preview_url = models.CharField(max_length=500, null=True, blank=True)
    youtube_link = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self) -> str:
        return '%s - %s'.format(self.name, self.artist)

