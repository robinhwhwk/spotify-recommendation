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
    path('recommendation/tracks/<str:tracks>/<str:artists>/<str:genres>', views.recommend_tracks, name='recommend-tracks'),
    path('recommendation/tracks/', views.recommend_tracks, name='recommend-tracks'),
    path('artists/', views.ArtistView.as_view(), name='artists'),
    path('artists/<str:name>', views.ArtistView.as_view(), name='artists'),
]