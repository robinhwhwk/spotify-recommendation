import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
from .constants import *

sp = spotipy.Spotify(client_credentials_manager=SpotifyClientCredentials())


# def play_audio(preview_url):
#       if not preview_url: return
#       if not audio.paused and audio.src == preview_url) return audio.pause()
#       audio.src = preview_url
#       audio.play()

