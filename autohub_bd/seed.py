import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'autohub.settings')
django.setup()

from decimal import Decimal
from django.contrib.auth import get_user_model
from dealerships.models import Dealership
from cars.models import Brand, CarModel, Generation, Car

User = get_user_model()

if not User.objects.filter(email='admin@autohub.ua').exists():
    User.objects.create_superuser(
        username='admin',
        email='admin@autohub.ua',
        password='admin123',
        role='admin',
    )

if not User.objects.filter(email='user@autohub.ua').exists():
    User.objects.create_user(
        username='user',
        email='user@autohub.ua',
        password='user123',
        role='user',
        first_name='Іван',
        last_name='Петренко',
        phone='+380501112233',
    )

dealerships_data = [
    {
        'name': 'AutoHub Центр',
        'district': 'Печерський',
        'address': 'вул. Хрещатик, 10',
        'latitude': Decimal('50.4501'),
        'longitude': Decimal('30.5234'),
        'phone': '+380441110001',
        'email': 'center@autohub.ua',
    },
    {
        'name': 'AutoHub Лівий берег',
        'district': 'Дніпровський',
        'address': 'просп. Соборності, 25',
        'latitude': Decimal('50.4515'),
        'longitude': Decimal('30.6018'),
        'phone': '+380441110002',
        'email': 'left@autohub.ua',
    },
    {
        'name': 'AutoHub Захід',
        'district': 'Святошинський',
        'address': 'просп. Перемоги, 134',
        'latitude': Decimal('50.4561'),
        'longitude': Decimal('30.3650'),
        'phone': '+380441110003',
        'email': 'west@autohub.ua',
    },
]

dealerships = []
for d in dealerships_data:
    obj, _ = Dealership.objects.get_or_create(name=d['name'], defaults=d)
    dealerships.append(obj)

catalog = {
    'Toyota': {
        'Camry': [('XV70', 2017, None)],
        'RAV4': [('XA50', 2018, None)],
    },
    'Volkswagen': {
        'Passat': [('B8', 2014, 2023)],
        'Tiguan': [('II', 2016, None)],
    },
    'BMW': {
        '3 Series': [('G20', 2018, None)],
        'X5': [('G05', 2018, None)],
    },
    'Tesla': {
        'Model 3': [('Highland', 2023, None)],
    },
}

generations = {}
for brand_name, models in catalog.items():
    brand, _ = Brand.objects.get_or_create(name=brand_name)
    for model_name, gens in models.items():
        car_model, _ = CarModel.objects.get_or_create(brand=brand, name=model_name)
        for gen_name, y_start, y_end in gens:
            gen, _ = Generation.objects.get_or_create(
                car_model=car_model,
                name=gen_name,
                defaults={'year_start': y_start, 'year_end': y_end},
            )
            generations[(brand_name, model_name)] = gen

cars_data = [
    {
        'gen': ('Toyota', 'Camry'), 'dealer_idx': 0,
        'year': 2021, 'body_type': 'sedan', 'fuel_type': 'petrol',
        'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used',
        'engine_volume': '2.5', 'power_hp': 200, 'mileage_km': 45000,
        'color': 'Чорний', 'avg_fuel_consumption': '7.5', 'price_uah': '950000.00',
    },
    {
        'gen': ('Toyota', 'RAV4'), 'dealer_idx': 1,
        'year': 2023, 'body_type': 'crossover', 'fuel_type': 'hybrid',
        'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new',
        'engine_volume': '2.5', 'power_hp': 222, 'mileage_km': 0,
        'color': 'Сріблястий', 'avg_fuel_consumption': '5.6', 'price_uah': '1450000.00',
    },
    {
        'gen': ('Volkswagen', 'Passat'), 'dealer_idx': 0,
        'year': 2019, 'body_type': 'sedan', 'fuel_type': 'diesel',
        'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used',
        'engine_volume': '2.0', 'power_hp': 190, 'mileage_km': 78000,
        'color': 'Білий', 'avg_fuel_consumption': '5.8', 'price_uah': '720000.00',
    },
    {
        'gen': ('Volkswagen', 'Tiguan'), 'dealer_idx': 2,
        'year': 2022, 'body_type': 'crossover', 'fuel_type': 'petrol',
        'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used',
        'engine_volume': '2.0', 'power_hp': 180, 'mileage_km': 22000,
        'color': 'Синій', 'avg_fuel_consumption': '8.2', 'price_uah': '1100000.00',
    },
    {
        'gen': ('BMW', '3 Series'), 'dealer_idx': 0,
        'year': 2022, 'body_type': 'sedan', 'fuel_type': 'petrol',
        'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'used',
        'engine_volume': '2.0', 'power_hp': 258, 'mileage_km': 18000,
        'color': 'Чорний', 'avg_fuel_consumption': '7.1', 'price_uah': '1650000.00',
    },
    {
        'gen': ('BMW', 'X5'), 'dealer_idx': 1,
        'year': 2024, 'body_type': 'suv', 'fuel_type': 'diesel',
        'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new',
        'engine_volume': '3.0', 'power_hp': 340, 'mileage_km': 0,
        'color': 'Графіт', 'avg_fuel_consumption': '7.8', 'price_uah': '3200000.00',
    },
    {
        'gen': ('Tesla', 'Model 3'), 'dealer_idx': 2,
        'year': 2024, 'body_type': 'sedan', 'fuel_type': 'electric',
        'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'new',
        'engine_volume': '0.0', 'power_hp': 283, 'mileage_km': 0,
        'color': 'Червоний', 'avg_fuel_consumption': '0.0', 'price_uah': '1850000.00',
    },
]

for c in cars_data:
    gen = generations[c['gen']]
    dealer = dealerships[c['dealer_idx']]
    Car.objects.get_or_create(
        generation=gen,
        dealership=dealer,
        year=c['year'],
        color=c['color'],
        defaults={
            'body_type': c['body_type'],
            'fuel_type': c['fuel_type'],
            'transmission': c['transmission'],
            'drive_type': c['drive_type'],
            'condition': c['condition'],
            'engine_volume': Decimal(c['engine_volume']),
            'power_hp': c['power_hp'],
            'mileage_km': c['mileage_km'],
            'avg_fuel_consumption': Decimal(c['avg_fuel_consumption']),
            'price_uah': Decimal(c['price_uah']),
        },
    )

print(f'Users: {User.objects.count()}')
print(f'Dealerships: {Dealership.objects.count()}')
print(f'Brands: {Brand.objects.count()}, Models: {CarModel.objects.count()}, Generations: {Generation.objects.count()}')
print(f'Cars: {Car.objects.count()}')
