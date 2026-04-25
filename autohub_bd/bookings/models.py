from django.db import models
from django.conf import settings
from cars.models import Car
from dealerships.models import Dealership


class TestDriveBooking(models.Model):
    class Status(models.TextChoices):
        PENDING = 'pending', 'Очікує підтвердження'
        CONFIRMED = 'confirmed', 'Підтверджено'
        CANCELLED = 'cancelled', 'Скасовано'

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='bookings')
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, related_name='bookings')
    booking_datetime = models.DateTimeField()
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.PENDING)
    phone = models.CharField(max_length=20, blank=True)
    comment = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Запис на тест-драйв'
        verbose_name_plural = 'Записи на тест-драйв'
        ordering = ['-created_at']
        unique_together = ('car', 'booking_datetime')

    def __str__(self):
        return f'{self.user} → {self.car} @ {self.booking_datetime:%d.%m.%Y %H:%M}'