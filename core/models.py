from django.db import models

# Create your models here.

class Playlists(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    last_updated = models.DateField()

    def __str__(self) -> str:
        return 'playlist id: %s'.format(self.id)

class Songs(models.Model):
    name = models.CharField(max_length=500)
    artist = models.CharField(max_length=500, null=True, blank=True)
    spotify_link = models.CharField(max_length=500, primary_key=True)
    preview_url = models.CharField(max_length=500, null=True, blank=True)
    youtube_link = models.CharField(max_length=500, null=True, blank=True)
    playlist = models.ForeignKey(Playlists, related_name='tracks', on_delete=models.CASCADE, null=True)
    image_url = models.CharField(max_length=500, null=True, blank=True)

    def __str__(self) -> str:
        return '%s - %s'.format(self.name, self.artist)


