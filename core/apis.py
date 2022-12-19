import spotipy
from spotipy.oauth2 import SpotifyClientCredentials


import os

import googleapiclient.discovery


import environ
env = environ.Env()
environ.Env.read_env()


sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials(), requests_timeout=10, retries=10)


# def play_audio(preview_url):
#       if not preview_url: return
#       if not audio.paused and audio.src == preview_url) return audio.pause()
#       audio.src = preview_url
#       audio.play()


scopes = ["https://www.googleapis.com/auth/youtube.readonly"]

# Disable OAuthlib's HTTPS verification when running locally.
    # *DO NOT* leave this option enabled in production.
os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"

api_service_name = "youtube"
api_version = "v3"

# Get credentials and create an API client

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=env("YT_KEY_2"))

def search_youtube(query):
    request = youtube.search().list(
        part="snippet",
        maxResults=1,
        q=query
    )
    try:
        response = request.execute()
        return response
    except:
        return None


def search_spotify(query, type='track'):
    if not query: 
        return
    if type=='genre':
        return get_genre_seeds(query)
    results = sp.search(query, 5, type=type)
    type = type + 's'
    results = results[type]['items']
    return results

def get_genre_seeds(query):
    if not query:
        return
    results = sp.recommendation_genre_seeds()
    results = results['genres']
    genres = []
    for genre in results:
        if query.lower() in genre.lower():
            genres.append(genre)
    return genres
    