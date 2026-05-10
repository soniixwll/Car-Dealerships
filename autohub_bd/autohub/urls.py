from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.throttling import ScopedRateThrottle
from rest_framework_simplejwt.views import TokenRefreshView


class ThrottledTokenRefreshView(TokenRefreshView):
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'auth'


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/auth/token/refresh/', ThrottledTokenRefreshView.as_view(), name='token_refresh'),
    path('api/dealerships/', include('dealerships.urls')),
    path('api/cars/', include('cars.urls')),
    path('api/bookings/', include('bookings.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
