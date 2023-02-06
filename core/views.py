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
import sys
from django.views.decorators.csrf import csrf_protect, csrf_exempt

# Create your views here.

class IndexView(View):
    moods = ['Happy', 'Sad', 'Rainy', 'Relaxed', 'Bored', 'Nostalgic', 'Workout', 'Lonely']
    
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
            playlist = Playlists.objects.filter(id=self.playlist_id, last_updated=self.current_date)[0].tracks.all().order_by('playlist_rank')
            if playlist:
                context = {
                    'tracks' : playlist,
                }
                return render(request, 'popular.html', context=context)
            else:

                playlist = sp.playlist(self.playlist_id)
                playlist = playlist['tracks']['items']
                save_playlist(playlist, self.playlist_id)
                context = {
                    'items' : playlist,
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
            'mood' : mood,
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


### View for getting track recommendations ###

@csrf_protect
def recommend_tracks(request):
    if request.method == 'POST':
        # tracks = request.GET.get('tracks')
        # artists = request.GET.get('artists')
        # genres = request.GET.get('genres')
        # seed_tracks = tracks.split(',') if tracks else ''
        # seed_artists= artists.split(',') if artists else ''
        # seed_genres = genres.split(',') if genres else ''

        # results = sp.recommendations(seed_artists=seed_artists, seed_tracks=seed_tracks, seed_genres=seed_genres, country='JP')

        # seeds = {}
        # if seed_tracks:
        #     seeds['seedTracks'] = seed_tracks
        # if seed_artists:
        #     seeds['seedArtists'] = seed_artists
        # if seed_genres:
        #     seeds['seedGenres'] = seed_genres
        # context = {
        #     'recommend_results': results['tracks'],
        #     'seeds': seeds,
        # }
        # return render(request, 'tracks.html', context=context)

        # seed_tracks = request.POST.get('seed-tracks').split(',')
        # seed_artists = request.POST.get('seed-artists').split(',')
        # seed_genres = request.POST.get('seed-genres').split(',')
        # print(seed_tracks)
        # results = sp.recommendations(seed_artists=seed_artists, seed_tracks=seed_tracks, seed_genres=seed_genres, country='JP')
        # context = {
        #      'recommend_results': results['tracks'],
        # }
        # return render(request, 'tracks.html', context=context)

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


### View for top artists and individual artists ###

class ArtistView(View):
    current_date = date.today()
    artist_list_name = 'top japan artists'
    def get(self, request, artistId=None):

        # without an input, return the normal page with top 50 artists
        if not artistId:
            # if the artist list was updated in the past day, fetch that data
            if ArtistList.objects.filter(name=self.artist_list_name,last_updated=self.current_date).exists():
                artists = ArtistList.objects.filter(name=self.artist_list_name,last_updated=self.current_date)[0].artist.all().order_by('-popularity')
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
                    print('here')
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
            if Artists.objects.filter(id=artistId, last_updated=self.current_date).exists():
                results = Artists.objects.filter(id=artistId)[0]
                if Artists.objects.filter(id=artistId, last_updated=self.current_date)[0].toptracks.all():
                    toptracks = Artists.objects.filter(id=artistId, last_updated=self.current_date)[0].toptracks.all().order_by('-popularity').values()
                    recommendations = sp.recommendations(seed_artists=[artistId])['tracks']
                    context = {
                        'artist': results,
                        'toptracks': toptracks,
                        'recommendations' : recommendations,
                    }
                    return render(request, 'artist.html', context=context)
                else:
                    toptracks = sp.artist_top_tracks(artist_id=artistId)['tracks']
                    save_tracks(toptracks, artistId)
                    recommendations = sp.recommendations(seed_artists=[artistId])['tracks']
                    context = {
                        'artist': results,
                        'toptracks': toptracks,
                        'recommendations' : recommendations,
                    }
                    return render(request, 'artist.html', context=context)
            else:
                results = sp.artist(artist_id=artistId)
                save_artists([results])
                toptracks = sp.artist_top_tracks(artist_id=artistId)['tracks']
                save_tracks(toptracks, artistId)
                recommendations = sp.recommendations(seed_artists=[artistId])['tracks']
                context = {
                    'artist': results,
                    'toptracks': toptracks,
                    'recommendations' : recommendations,
                }
                return render(request, 'artist.html', context=context)

### View for creating a playlist ### 

class PlaylistView(View):
    def get(self, request):
        print('here')
        scope = "user-library-read playlist-modify-private playlist-modify-public"
        if len(sys.argv) > 1:
            username = sys.argv[1]
        else:
            print("Usage: %s username" % (sys.argv[0],))
            sys.exit()
        token = util.prompt_for_user_token(username, scope, redirect_uri='http://127.0.0.1:8000/callback/')
        results = None
        
        if token:
            auth_manager = SpotifyOAuth(scope=scope, redirect_uri='http://127.0.0.1:8000/callback/')
            sp = spotipy.Spotify(auth_manager=auth_manager, auth=token)
            results = sp.current_user_playlists(5)['items']

            # Redirect the user to the authorization URL
            # You can do this using Django's redirect function or by sending an HTTP redirect
            # response to the user's browser
            context = {
                'playlists':results,
            }
            return render(request, 'tracks.html', context=context)


### View for Individual tracks ###

class TrackView(View):
    def get(self, request, trackId):
        if Songs.objects.filter(id=trackId).exists():
            # if the song already exists in our database
            track = Songs.objects.filter(id=trackId)[0]
            lyrics = get_lyrics(track.name, track.artist)
            context = {
                'track': track,
                'lyrics': lyrics,
            }
            return render(request, 'track.html', context=context)
        else:
            # if the song doesn't exist in our database
            track = sp.track(trackId)
            lyrics = get_lyrics(track['name'], track['artists'][0]['name'])
            album_id = track['album']['id']
            album = sp.album(album_id=album_id)['tracks']['items']
            recommendations = sp.recommendations(seed_tracks=trackId)['tracks']
            context = {
                'spotify_track': track,
                'lyrics': lyrics,
                'album' : album,
                'recommendations' : recommendations,
            }
            return render(request, 'track.html', context=context)