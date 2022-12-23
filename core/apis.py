import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.oauth2 import SpotifyClientCredentials
import spotipy.util as util
import os
import googleapiclient.discovery


scope = "user-library-read playlist-modify-private playlist-modify-public"

auth_manager = SpotifyOAuth(scope=scope, redirect_uri='http://127.0.0.1:5050/callback/')

sp = spotipy.Spotify(auth_manager=auth_manager)


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
    api_service_name, api_version, developerKey=os.environ("YOUTUBE_KEY"))

def search_youtube(query, type='track'):
    request = youtube.search().list(
        part="snippet",
        type=type,
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
    