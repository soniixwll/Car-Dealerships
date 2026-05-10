from rest_framework import serializers
from .models import TestDriveBooking
from django.utils import timezone


class BookingSerializer(serializers.ModelSerializer):
    car_display = serializers.SerializerMethodField()
    dealership_name = serializers.CharField(source='dealership.name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    phone = serializers.CharField(required=True, allow_blank=False)
    comment = serializers.CharField(required=False, allow_blank=True, max_length=1000)

    class Meta:
        model = TestDriveBooking
        fields = ('id', 'car', 'car_display', 'dealership', 'dealership_name', 'booking_datetime', 'status', 'status_display', 'phone', 'comment', 'created_at')
        read_only_fields = ('status', 'created_at', 'user')

    def get_car_display(self, obj):
        car = obj.car
        return f'{car.generation.car_model.brand.name} {car.generation.car_model.name} {car.year}'

    def validate_booking_datetime(self, value):
        if value <= timezone.now():
            raise serializers.ValidationError('Дата запису має бути у майбутньому')
        return value

    def validate_phone(self, value):
        phone = value.strip()
        if not phone.startswith('+380') or len(phone) != 13 or not phone[1:].isdigit():
            raise serializers.ValidationError('Введіть номер у форматі +380XXXXXXXXX')
        return phone

    def validate(self, attrs):
        car = attrs.get('car')
        dealership = attrs.get('dealership')
        booking_datetime = attrs.get('booking_datetime')

        if car and dealership and car.dealership_id != dealership.id:
            raise serializers.ValidationError({'dealership': 'Цей автомобіль не належить обраному салону'})

        if car and booking_datetime:
            taken = TestDriveBooking.objects.filter(
                car=car, booking_datetime=booking_datetime,
            ).exclude(status=TestDriveBooking.Status.CANCELLED)
            if self.instance:
                taken = taken.exclude(pk=self.instance.pk)
            if taken.exists():
                raise serializers.ValidationError({'booking_datetime': 'Цей час вже зайнятий'})
        return attrs

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)
