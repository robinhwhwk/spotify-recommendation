from .apis import *
from .models import *

def save_playlist(playlist, playlist_id=None):
    # playlist is a list of songs returned by the spotipy api
    if not playlist: 
        return
    for item in playlist:
        track = item['track']
        name = track['name']
        artist = track['artists'][0]['name']
        spotify_link = track['external_urls']['spotify']
        preview_url = track['preview_url']
        if not Songs.objects.filter(spotify_link=spotify_link).exists():
            query = name + ' - ' + artist
            image_url = track['album']['images'][0]['url']
            youtube_response = youtube_search(query=query)
            if not youtube_response:
                song = Songs(name, artist, spotify_link, preview_url, None, playlist_id, image_url)
                song.save()
            else:
                youtube_id = youtube_response['items'][0]['id']['videoId']
                youtube_link = 'https://www.youtube.com/watch?v=%s'.format(youtube_id)
                song = Songs(name, artist, spotify_link, preview_url, youtube_link, playlist_id, image_url)
                song.save()

def save_tracks(tracks):
    if not tracks: 
        return
    for track in tracks:
        name = track['name']
        artist = track['artists'][0]['name']
        spotify_link = track['external_urls']['spotify']
        preview_url = track['preview_url']
        if not Songs.objects.filter(spotify_link=spotify_link).exists():
            query = name + ' - ' + artist
            image_url = track['album']['images'][0]['url']
            youtube_response = youtube_search(query=query)
            if not youtube_response:
                song = Songs(name, artist, spotify_link, preview_url, youtube_link=None, playlist_id=None, image_url=image_url)
                song.save()
            else:
                youtube_id = youtube_response['items'][0]['id']['videoId']
                youtube_link = 'https://www.youtube.com/watch?v=%s'.format(youtube_id)
                song = Songs(name, artist, spotify_link, preview_url, youtube_link, playlist_id=None, image_url=None)
                song.save()
