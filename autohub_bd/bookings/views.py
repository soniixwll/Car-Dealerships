from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets, decorators, permissions, response
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
