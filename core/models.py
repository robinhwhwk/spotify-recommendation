from django.db import models
from django.utils import timezone

# Create your models here.

class Playlists(models.Model):
    id = models.CharField(max_length=500, primary_key=True)
    last_updated = models.DateField()

    def __str__(self) -> str:
        return 'playlist id: %s'.format(self.id)

class ArtistList(models.Model):
    name = models.CharField(max_length=500, primary_key=True)
    last_updated = models.DateField()
    list = models.CharField(max_length=50000)

    def __str__(self) -> str:
        return 'artist list: %s'.format(self.name)

class Songs(models.Model):
    id = models.CharField(max_length=500, primary_key=True, default='')
    name = models.CharField(max_length=500)
    artist = models.CharField(max_length=500, default=None, null=True, blank=True)
    spotify_link = models.CharField(max_length=500)
    preview_url = models.CharField(max_length=500, null=True, blank=True)
    youtube_link = models.CharField(max_length=500, null=True, blank=True)
    playlist = models.ForeignKey(Playlists, related_name='tracks', on_delete=models.CASCADE, null=True)
    playlist_rank = models.IntegerField(null=True, blank=True)
    image_url = models.CharField(max_length=500, null=True, blank=True)
    artist_id = models.ForeignKey('Artists', null=True, blank=True, related_name='toptracks', on_delete=models.SET_NULL)
    popularity = models.IntegerField(null=True, blank=True)

    def __str__(self) -> str:
        return '%s - %s'.format(self.name, self.artist)

class Artists(models.Model):
    id = models.CharField(max_length=500, primary_key=True, default='')
    name = models.CharField(max_length=500)
    spotify_link = models.CharField(max_length=500)
    youtube_link = models.CharField(max_length=500, null=True, blank=True)
    top_album = models.ForeignKey(Playlists, related_name='artist', on_delete=models.CASCADE, null=True, blank=True)
    image_url = models.CharField(max_length=500, null=True, blank=True)
    artist_list = models.ForeignKey(ArtistList, related_name='artist', on_delete=models.CASCADE, null=True, blank=True)
    popularity = models.IntegerField(null=True, blank=True)
    followers = models.IntegerField(null=True, default=True)
    last_updated = models.DateField(null=True, blank=True, default=timezone.now)
    def __str__(self) -> str:
        return '%s'.format(self.name)




