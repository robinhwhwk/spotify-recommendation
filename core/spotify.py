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

def generate_mood_playlist(mood):
    if not mood:
        return

    seed_genres = ['j-pop', 'j-dance', 'j-idol']

    ranges = {
        'Happy': {
            'market':'JP',
            'limit': 20,
            'max_danceability': 1,
            'max_energy': 1,
            'max_valence' : 1,
            'min_danceability': 0.6,
            'min_energy' : 0.6,
            'min_valence' : 0.8,
        },
        'Sad': {
            'market':'JP',
            'limit': 20,
            'min_valence':0.0,
            'max_valence': 0.4,
            'min_energy':0.2,
            'max_energy': 0.4,
            'min_acousticness':0.5,
            'max_acousticness':1.0,
            'min_instrumentalness':0.0,
            'max_instrumentalness':0.2,
        },
        'Angry': {
            'market':'JP',
            'limit': 20,
            'min_acousticness': 0.0,
            'max_acousticness': 0.3,
            'min_energy': 0.6,
            'max_energy': 1.0,
            'min_instrumentalness': 0.0,
            'max_instrumentalness': 0.4,
            'min_key': 3,
            'max_key': 8,
            'min_liveness': 0.0,
            'max_liveness': 0.3,
            'min_loudness': -10.0,
            'max_loudness': 0.0,
            'min_tempo': 140.0,
            'max_tempo': 190.0,
            'min_valence': 0.0,
            'max_valence': 0.5
        },
        'Relaxed': {
            'market':'JP',
            'limit': 20,
            'min_acousticness': 0.4,
            'min_danceability': 0.1,
            'max_danceability': 0.5,
            'max_energy': 0.4,
        },
        'Bored': {
            'market':'JP',
            'limit': 20,
            'min_valence': 0.1,
            'max_energy': 0.2
        },
        'Nostalgic': {
            'market':'JP',
            'limit': 20,
            'min_acousticness': 0.5,
            'max_acousticness': 0.9,
            'max_danceability': 0.5,
            'min_energy': 0.1,
            'max_energy': 0.4,
            'max_liveness': 0.5,
            'min_valence': 0.4,
            'max_energy': 0.6
        },
        'Anxious': {
            'market':'JP',
            'limit': 20,
            'min_valence': 0.1,
            'max_energy': 0.4
        },
        'Lonely': {
            'market':'JP',
            'limit': 20,
            'min_valence': 0.1,
            'max_energy': 0.2,
            'min_acousticness': 0.4,
        }
    }
    params = ranges[mood]
    results = sp.recommendations(seed_genres=seed_genres, **params) 

    return results['tracks']
    