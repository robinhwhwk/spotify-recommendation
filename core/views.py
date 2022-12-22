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
            return render(request, 'popular.html', context=context)

        pl = Playlists(self.playlist_id, self.current_date)
        pl.save()

        playlist = sp.playlist(self.playlist_id)
        playlist = playlist['tracks']['items']
        save_playlist(playlist, self.playlist_id)
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
        type = body['type']
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
            youtube_response = search_youtube(query=query, type=type)
            if type == 'video':
                video_id = youtube_response['items'][0]['id']['videoId']

                # Return the video ID as the response
                return JsonResponse({'video_id': video_id})
            elif type=='channel':
                channel_id = youtube_response['items'][0]['id']['channelId']
                return JsonResponse({'channel_id': channel_id})

@csrf_protect
def recommend_tracks(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        seed_tracks = data['seedTracks'].split(',')
        seed_artists = data['seedArtists'].split(',')
        seed_genres = data['seedGenres'].split(',')
        results = sp.recommendations(seed_artists=seed_artists, seed_tracks=seed_tracks, seed_genres=seed_genres, country='JP')
        seeds = {}
        if len(seed_tracks) > 1:
            seeds['seedTracks'] = data['seedTracks']
        if len(seed_artists) > 1:
            seeds['seedArtists'] = data['seedArtists']
        if len(seed_genres) > 1:
            seeds['seedGenres'] = data['seedGenres']
        context = {
            'recommend_results': results['tracks'],
            'seeds': seeds,
        }
        return render(request, 'tracks.html', context=context)
    if request.method == 'GET':
        return render(request,'tracks.html')


class ArtistView(View):
    current_date = date.today()
    artist_list_name = 'top japan artists'
    def get(self, request, artistId=None):

        # without an input, return the normal page with top 50 artists
        if not artistId:
            # if the artist list was updated in the past day, fetch that data
            if ArtistList.objects.filter(name=self.artist_list_name,last_updated=self.current_date).exists():
                artists = ArtistList.objects.filter(name=self.artist_list_name,last_updated=self.current_date)[0].artist.all()
                # if the artist list is empty, search spotify
                if not artists:
                    query = 'genre:j-pop'
                    genre = ['j-pop']
                    # array of dictionary of artists
                    results = sp.search(query, type='artist', market='JP', limit=50)
                    results = results['artists']['items']
                    artists_by_popularity = sorted(results, key=lambda artist: artist['popularity'], reverse=True)
                    context = {
                        'artists': artists_by_popularity,
                    }
                    artistList = ArtistList(self.artist_list_name, self.current_date, artists_by_popularity)
                    artistList.save()

                    save_artists(artists_by_popularity, artistList)
                    return render(request, 'artists.html', context=context)
                # if the artist list is not empty
                else:
                    context = {
                        'artists': artists,
                    }
                    return render(request, 'artists.html', context=context)
            # if the artist list wasn't updated in the past day
            else:
                query = 'genre:j-pop'
                # array of dictionary of artists
                results = sp.search(query, type='artist', market='JP', limit=50)
                results = results['artists']['items']
                artists_by_popularity = sorted(results, key=lambda artist: artist['popularity'], reverse=True)
                context = {
                    'artists': artists_by_popularity,
                }
                artistList = ArtistList(self.artist_list_name, self.current_date, artists_by_popularity)
                artistList.save()

                save_artists(artists_by_popularity, artistList)
                return render(request, 'artists.html', context=context)

        # with an artist id parameter, return the artist's page
        else:
        
            results = sp.artist(artist_id=artistId)
            context = {
                'artist': results,
            }
            return render(request, 'artist.html', context=context)