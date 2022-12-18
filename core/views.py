from django.shortcuts import render
from django.http import HttpRequest
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.views import View
from django.urls import reverse
from django.db.models import Q  # for queries
from datetime import date
from .apis import *
from .spotify import *
from .models import *

# Create your views here.

class IndexView(View):

    def get(self, request):

        return render(request, 'index.html')

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
        query = self.request.GET.get('q')
        tracks = search_tracks(query)
        save_tracks(tracks)
        context = {
            'tracks': tracks,
        }
        return render(request, 'recommendations.html', context=context)

