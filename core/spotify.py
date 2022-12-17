from .apis import *
from .models import *

def save_playlist(playlist):
    # playlist is a list of songs returned by the spotipy api
    if not playlist: 
        return
    for item in playlist:
        track = item['track']
        name = track['name']
        artist = track['artists'][0]
        spotify_link = track['external_urls']['spotify']
        preview_url = track['preview_url']
        if not Songs.objects.filter(name=name, artist=artist).exists():
            song = Songs(name, artist, spotify_link, preview_url, None)
            song.save()
