from django.shortcuts import render
from django.http import HttpRequest
from django.http import HttpResponse
from django.http import HttpResponseRedirect
from django.template import loader
from django.shortcuts import render
from django.views import View
from django.urls import reverse
from django.db.models import Q  # for queries

# Create your views here.

class IndexView(View):

    def get(self, request):

        return render(request, 'index.html')

class PopularView(View):

    def get(self, request):

        return render(request, 'popular.html')

class RecommendationView(View):

    def get(self, request):

        return render(request, 'recommendations.html')