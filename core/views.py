from django.shortcuts import render
from django.http import HttpRequest
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.http import JsonResponse
from django.template import loader
from django.shortcuts import render
from django.views import View
from django.urls import reverse
from django.db.models import Q  # for queries
from datetime import date
from .apis import *
from .spotify import *
from .models import *
import json
from django.views.decorators.csrf import csrf_protect, csrf_exempt

# Create your views here.

class IndexView(View):
    moods = ['Happy', 'Sad', 'Angry', 'Relaxed', 'Bored', 'Nostalgic', 'Anxious', 'Lonely']
    
    def get(self, request):
        # return the list of tracks based on moods 
        context = {
            'moods': self.moods,
        }
        return render(request, 'index.html', context=context)

class PopularView(View):

    playlist_id = '37i9dQZEVXbKXQ4mDTEBXq'
    current_date = date.today()

    def get(self, request):
        # Playlist was updated in the last day
        if Playlists.objects.filter(id=self.playlist_id, last_updated=self.current_date).exists():
            playlist = Playlists.objects.filter(id=self.playlist_id, last_updated=self.current_date)[0].tracks.all()
            context = {
                'tracks' : playlist,
            }
            print(1)
            return render(request, 'popular.html', context=context)

        pl = Playlists(self.playlist_id, self.current_date)
        pl.save()

        playlist = sp.playlist(self.playlist_id)
        playlist = playlist['tracks']['items']
        save_playlist(playlist, self.playlist_id)
        print(2)
        context = {
            'items' : playlist,
        }

        return render(request, 'popular.html', context=context)

class RecommendationView(View):

    def get(self, request):
        return render(request, 'recommendations.html')

class SearchTracksView(View):

    def get(self, request):

        # The type for results is one of track, artist, or genre
        
        query = self.request.GET.get('q')
        type = self.request.GET.get('type')

        if not type:
            type = 'track'
        results = search_spotify(query, type)

        type = type + 's'
        
        context = {
            type: results,
        }
        return render(request, 'recommendations.html', context=context)

class MoodTracksView(View):

    def get(self, request, mood):
        tracks = generate_mood_playlist(mood)
        save_tracks(tracks)
        context = {
            'tracks': tracks,
        }
        return render(request, 'moodtracks.html', context=context)

@csrf_protect
def youtube(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        if not body:
            return JsonResponse({'video_id' : 'None'})
        title = body['title']
        artist = body['artist']
        query = title + ' ' + artist
        if Songs.objects.filter(name=title, artist=artist).exists():
            song = Songs.objects.filter(name=title, artist=artist).all()[0]
            if song.youtube_link:
                return JsonResponse({'video_id': song.youtube_link})
            else:
                youtube_response = search_youtube(query=query)
                video_id = youtube_response['items'][0]['id']['videoId']
                song.youtube_link = video_id
                song.save()

                # Return the video ID as the response
                return JsonResponse({'video_id': video_id})
        else:
            youtube_response = search_youtube(query=query)
            video_id = youtube_response['items'][0]['id']['videoId']

            # Return the video ID as the response
            return JsonResponse({'video_id': video_id})