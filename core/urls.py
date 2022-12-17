from django.contrib import admin
from django.urls import path
from django.conf.urls import include
from core import views


urlpatterns = [
    path('', views.IndexView.as_view()),
    path('index/', views.IndexView.as_view(), name='index'),
    path('popular/', views.PopularView.as_view(), name='popular'),
    path('recommendation/', views.RecommendationView.as_view(), name='recommendation'),
]