from django.conf import settings
from django.db import models
from dealerships.models import Dealership


class Brand(models.Model):
    name = models.CharField(max_length=50, unique=True)

    class Meta:
        verbose_name = 'Марка'
        verbose_name_plural = 'Марки'
        ordering = ['name']

    def __str__(self):
        return self.name


class CarModel(models.Model):
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE, related_name='models')
    name = models.CharField(max_length=100)

    class Meta:
        verbose_name = 'Модель'
        verbose_name_plural = 'Моделі'
        unique_together = ('brand', 'name')
        ordering = ['name']

    def __str__(self):
        return f'{self.brand.name} {self.name}'


class Generation(models.Model):
    car_model = models.ForeignKey(CarModel, on_delete=models.CASCADE, related_name='generations')
    name = models.CharField(max_length=50)
    year_start = models.PositiveSmallIntegerField()
    year_end = models.PositiveSmallIntegerField(null=True, blank=True)

    class Meta:
        verbose_name = 'Покоління'
        verbose_name_plural = 'Покоління'

    def __str__(self):
        year_end = self.year_end or 'н.ч.'
        return f'{self.car_model} {self.name} ({self.year_start}–{year_end})'


class Car(models.Model):
    class BodyType(models.TextChoices):
        SEDAN = 'sedan', 'Седан'
        HATCHBACK = 'hatchback', 'Хетчбек'
        CROSSOVER = 'crossover', 'Кросовер'
        SUV = 'suv', 'Позашляховик'
        MINIVAN = 'minivan', 'Мінівен'
        COUPE = 'coupe', 'Купе'
        PICKUP = 'pickup', 'Пікап'
        WAGON = 'wagon', 'Універсал'

    class FuelType(models.TextChoices):
        PETROL = 'petrol', 'Бензин'
        DIESEL = 'diesel', 'Дизель'
        GAS = 'gas', 'Газ (LPG)'
        HYBRID = 'hybrid', 'Гібрид'
        ELECTRIC = 'electric', 'Електро'

    class Transmission(models.TextChoices):
        MANUAL = 'manual', 'Механіка'
        AUTOMATIC = 'automatic', 'Автомат'
        CVT = 'cvt', 'Варіатор'
        ROBOT = 'robot', 'Робот'

    class DriveType(models.TextChoices):
        FWD = 'fwd', 'Передній'
        RWD = 'rwd', 'Задній'
        AWD = 'awd', 'Повний'

    class Condition(models.TextChoices):
        NEW = 'new', 'Новий'
        USED = 'used', 'Вживаний'

    class Status(models.TextChoices):
        AVAILABLE = 'available', 'В наявності'
        RESERVED = 'reserved', 'Заброньовано'
        SOLD = 'sold', 'Продано'

    generation = models.ForeignKey(Generation, on_delete=models.CASCADE, related_name='cars')
    dealership = models.ForeignKey(Dealership, on_delete=models.CASCADE, related_name='cars')

    year = models.PositiveSmallIntegerField()
    body_type = models.CharField(max_length=20, choices=BodyType.choices)
    fuel_type = models.CharField(max_length=10, choices=FuelType.choices)
    transmission = models.CharField(max_length=10, choices=Transmission.choices)
    drive_type = models.CharField(max_length=5, choices=DriveType.choices)
    condition = models.CharField(max_length=5, choices=Condition.choices)

    engine_volume = models.DecimalField(max_digits=3, decimal_places=1)
    power_hp = models.PositiveSmallIntegerField()
    mileage_km = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=50)

    avg_fuel_consumption = models.DecimalField(
        max_digits=4, decimal_places=1,
        help_text='Середнє споживання палива, л/100км'
    )

    price_uah = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=Status.choices, default=Status.AVAILABLE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Автомобіль'
        verbose_name_plural = 'Автомобілі'
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.generation.car_model} {self.year} — {self.dealership.name}'


class CarImage(models.Model):
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='cars/')
    is_main = models.BooleanField(default=False)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']


class Favorite(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='favorites')
    car = models.ForeignKey(Car, on_delete=models.CASCADE, related_name='favorited_by')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Обране'
        verbose_name_plural = 'Обране'
        unique_together = ('user', 'car')
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user.email} favorite {self.car}'
