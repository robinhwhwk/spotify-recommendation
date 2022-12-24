from .apis import *
from .models import *
from django.utils import timezone
from datetime import date

def save_playlist(playlist, playlist_id=None, artist_id=None):
    # playlist is a list of songs returned by the spotipy api
    if not playlist: 
        return
    for index, item in enumerate(playlist):
        track = item['track']
        id = track['id']
        name = track['name']
        artist = track['artists'][0]['name']
        if not Artists.objects.filter(id=artist_id).exists():
            artist_id = None
        spotify_link = track['external_urls']['spotify']
        preview_url = track['preview_url']
        popularity = track['popularity']
        image_url = track['album']['images'][0]['url']
        if not Songs.objects.filter(id=id).exists():
            song = Songs(id, name, artist, spotify_link, preview_url, None, playlist_id, index, image_url, artist_id=artist_id, popularity=popularity)
            song.save()
        else:
            song = Songs.objects.filter(id=id)
            song.update(playlist_id=playlist_id, playlist_rank=index)

def save_tracks(tracks, artist_id=None):
    if not tracks: 
        return
    for track in tracks:
        id = track['id']
        name = track['name']
        artist = track['artists'][0]['name']
        if not Artists.objects.filter(id=artist_id).exists():
            artist_id = None
        spotify_link = track['external_urls']['spotify']
        preview_url = track['preview_url']
        popularity = track['popularity']
        image_url = track['album']['images'][0]['url']
        # adding a new song to the database
        if not Songs.objects.filter(id=id).exists():
            song = Songs(id, name, artist, spotify_link, preview_url, youtube_link=None, playlist_id=None, image_url=image_url, 
            artist_id= Artists.objects.get(id=artist_id) if artist_id else None, popularity=popularity)
            song.save()
        # just updating artist_id of existing song
        elif artist_id:
            song = Songs.objects.filter(id=id)
            song.update(artist_id=Artists.objects.get(id=artist_id))    



def generate_mood_playlist(mood):
    if not mood:
        return

    ranges = {
        'Happy': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'happy'],
            'market':'JP',
            'limit': 20,
        },
        'Sad': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'sad'],
            'market':'JP',
            'limit': 20,
        },
        'Rainy': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'rainy-day'],
            'market':'JP',
            'limit': 20,
        },
        'Relaxed': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'chill'],
            'market':'JP',
            'limit': 20,
        },
        'Bored': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'ambient'],
            'market':'JP',
            'limit': 20,
        },
        'Nostalgic': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'blues'],
            'market':'JP',
            'limit': 20,
        },
        'Workout': {
            'seed_genres' : ['j-pop', 'j-dance', 'j-idol', 'anime', 'work-out'],
            'market':'JP',
            'limit': 20,
        },
        'Lonely': {
            'seed_genres' : ['j-pop', 'j-idol', 'anime', 'folk', 'jazz'],
            'market':'JP',
            'limit': 20,
        }
    }
    params = ranges[mood]
    results = sp.recommendations(**params) 

    return results['tracks']
    

def save_artists(artists, artist_list=None):
    if not artists: 
        return
    for artist in artists:
        id = artist['id']
        if not Artists.objects.filter(id=id, last_updated=str(date.today())).exists():
            name = artist['name']
            spotify_link = artist['external_urls']['spotify']
            image_url = artist['images'][0]['url'] if artist['images'] else None
            popularity = artist['popularity']
            followers = artist['followers']['total']
            if artist_list:
                artist = Artists(id, name, spotify_link, image_url=image_url, artist_list=artist_list, popularity=popularity, followers=followers, last_updated=date.today())
            else:
                artist = Artists(id, name, spotify_link, image_url=image_url, popularity=popularity, followers=followers, last_updated=date.today())
            artist.save()