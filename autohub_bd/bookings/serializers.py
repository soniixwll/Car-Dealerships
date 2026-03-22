from rest_framework import serializers
from .models import TestDriveBooking
from django.utils import timezone


class BookingSerializer(serializers.ModelSerializer):
    car_display = serializers.SerializerMethodField()
    dealership_name = serializers.CharField(source='dealership.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = TestDriveBooking
        fields = ('id', 'car', 'car_display', 'dealership', 'dealership_name', 'booking_datetime', 'status', 'status_display', 'comment', 'created_at')
        read_only_fields = ('status', 'created_at', 'user')

    def get_car_display(self, obj):
        car = obj.car
        return f'{car.generation.car_model.brand.name} {car.generation.car_model.name} {car.year}'

    def validate_booking_datetime(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError('Дата запису має бути у майбутньому')
        return value

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
