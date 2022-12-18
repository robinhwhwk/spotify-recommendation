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
client_secrets_file = "YOUR_CLIENT_SECRET_FILE.json"

# Get credentials and create an API client

youtube = googleapiclient.discovery.build(
    api_service_name, api_version, developerKey=env("YOUTUBE_KEY"))

def youtube_search(query):
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


def search_tracks(query):
    if not query: 
        return
    results = sp.search(query, 10, type='track')
    results = results['tracks']['items']
    return results