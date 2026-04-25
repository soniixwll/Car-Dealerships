from datetime import datetime
from django.utils import timezone
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, decorators, permissions, response, status as drf_status
from .models import TestDriveBooking
from .serializers import BookingSerializer


class BookingViewSet(viewsets.ModelViewSet):
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        user = self.request.user
        if user.is_staff:
            return TestDriveBooking.objects.select_related('user', 'car', 'dealership').all()
        return TestDriveBooking.objects.filter(user=user).select_related('car', 'dealership')

    @decorators.action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def confirm(self, request, pk=None):
        booking = self.get_object()
        booking.status = TestDriveBooking.Status.CONFIRMED
        booking.save()
        return response.Response({'status': 'confirmed'})

    @decorators.action(detail=True, methods=['patch'], permission_classes=[permissions.IsAdminUser])
    def cancel(self, request, pk=None):
        booking = self.get_object()
        booking.status = TestDriveBooking.Status.CANCELLED
        booking.save()
        return response.Response({'status': 'cancelled'})

    @decorators.action(detail=False, methods=['get'], permission_classes=[permissions.AllowAny])
    def availability(self, request):
        car_id = request.query_params.get('car')
        date_str = request.query_params.get('date')
        if not car_id or not date_str:
            return response.Response({'detail': 'car and date are required'}, status=drf_status.HTTP_400_BAD_REQUEST)
        try:
            date = datetime.strptime(date_str, '%Y-%m-%d').date()
        except ValueError:
            return response.Response({'detail': 'date must be in YYYY-MM-DD format'}, status=drf_status.HTTP_400_BAD_REQUEST)

        bookings = TestDriveBooking.objects.filter(
            car_id=car_id,
            booking_datetime__date=date,
        ).exclude(status=TestDriveBooking.Status.CANCELLED).values_list('booking_datetime', flat=True)
        taken_times = sorted({timezone.localtime(bd).strftime('%H:%M') for bd in bookings})
        return response.Response({'taken_times': taken_times})
