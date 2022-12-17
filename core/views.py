from django.shortcuts import render
from django.http import HttpRequest
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.views import View
from django.urls import reverse
from django.db.models import Q  # for queries
from .apis import *
from .spotify import *
from .models import *

# Create your views here.

class IndexView(View):

    def get(self, request):

        return render(request, 'index.html')

class PopularView(View):

    playlist_id = '37i9dQZEVXbKXQ4mDTEBXq'

    def get(self, request):
        playlist = sp.playlist(self.playlist_id)
        playlist = playlist['tracks']['items']
        save_playlist(playlist)
        context = {
            'playlist' : playlist,
        }

        return render(request, 'popular.html', context=context)

class RecommendationView(View):

    def get(self, request):

        return render(request, 'recommendations.html')