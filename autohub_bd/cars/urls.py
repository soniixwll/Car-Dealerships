from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import BrandViewSet, CarViewSet, FavoriteViewSet

router = DefaultRouter()
router.register('brands', BrandViewSet, basename='brand')
router.register('favorites', FavoriteViewSet, basename='favorite')
router.register('', CarViewSet, basename='car')
urlpatterns = [path('', include(router.urls))]
