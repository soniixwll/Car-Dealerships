from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CarViewSet

router = DefaultRouter()
router.register('brands', BrandViewSet, basename='brand')
router.register('', CarViewSet, basename='car')
urlpatterns = [path('', include(router.urls))]
