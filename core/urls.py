from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from core import views


urlpatterns = [
    path('', views.IndexView.as_view()),
    path('index/', views.IndexView.as_view(), name='index'),
    path('popular/', views.PopularView.as_view(), name='popular'),
    path('youtube/', views.youtube, name='youtube'),
    path('recommendation/', views.SearchTracksView.as_view(), name='recommendation'),
    path('recommendation/search/', views.SearchTracksView.as_view(), name='searchtracks'),
    path('moods/<str:mood>', views.MoodTracksView.as_view(), name='moodtracks'),
    path('recommendation/tracks/', views.recommend_tracks, name='recommend-tracks'),
    path('artists/', views.ArtistView.as_view(), name='artists'),
    path('artists/<str:artistId>', views.ArtistView.as_view(), name='artists'),
    path('playlist/', views.PlaylistView.as_view(), name='playlist'),
    path('callback/', views.PlaylistView.as_view(), name='callback'),
    path('popular/tracks/<str:trackId>', views.TrackView.as_view(), name='tracks'),
    path('tracks/<str:trackId>', views.TrackView.as_view(), name='tracks'),
    path('tracks/', views.TrackView.as_view(), name='lyricsfinder'),
]