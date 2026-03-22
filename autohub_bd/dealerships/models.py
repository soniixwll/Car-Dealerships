from django.db import models


class Dealership(models.Model):
    name = models.CharField(max_length=100)
    district = models.CharField(max_length=100)
    address = models.CharField(max_length=255)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    working_hours = models.CharField(max_length=100, default='Пн-Сб: 9:00–19:00')
    is_active = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Автосалон'
        verbose_name_plural = 'Автосалони'

    def __str__(self):
        return f'{self.name} ({self.district})'