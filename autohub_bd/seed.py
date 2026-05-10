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
        'name': 'AutoHub Київ Центр',
        'district': 'Печерський',
        'address': 'вул. Хрещатик, 10',
        'latitude': Decimal('50.4501'), 'longitude': Decimal('30.5234'),
        'phone': '+380441110001', 'email': 'kyiv-center@autohub.ua',
    },
    {
        'name': 'AutoHub Київ Лівий берег',
        'district': 'Дніпровський',
        'address': 'просп. Соборності, 25',
        'latitude': Decimal('50.4515'), 'longitude': Decimal('30.6018'),
        'phone': '+380441110002', 'email': 'kyiv-left@autohub.ua',
    },
    {
        'name': 'AutoHub Київ Захід',
        'district': 'Святошинський',
        'address': 'просп. Перемоги, 134',
        'latitude': Decimal('50.4561'), 'longitude': Decimal('30.3650'),
        'phone': '+380441110003', 'email': 'kyiv-west@autohub.ua',
    },
    {
        'name': 'AutoHub Київ Оболонь',
        'district': 'Оболонський',
        'address': 'просп. Оболонський, 45',
        'latitude': Decimal('50.5108'), 'longitude': Decimal('30.4982'),
        'phone': '+380441110004', 'email': 'kyiv-obolon@autohub.ua',
    },

    {
        'name': 'AutoHub Львів Центр',
        'district': 'Галицький',
        'address': 'просп. Свободи, 18',
        'latitude': Decimal('49.8419'), 'longitude': Decimal('24.0315'),
        'phone': '+380322220001', 'email': 'lviv-center@autohub.ua',
    },
    {
        'name': 'AutoHub Львів Сихів',
        'district': 'Сихівський',
        'address': 'вул. Сихівська, 12',
        'latitude': Decimal('49.7864'), 'longitude': Decimal('24.0541'),
        'phone': '+380322220002', 'email': 'lviv-sykhiv@autohub.ua',
    },
    {
        'name': 'AutoHub Львів Шевченківський',
        'district': 'Шевченківський',
        'address': 'вул. Городоцька, 220',
        'latitude': Decimal('49.8385'), 'longitude': Decimal('23.9722'),
        'phone': '+380322220003', 'email': 'lviv-shev@autohub.ua',
    },

    {
        'name': 'AutoHub Харків Центр',
        'district': 'Шевченківський',
        'address': 'вул. Сумська, 56',
        'latitude': Decimal('49.9988'), 'longitude': Decimal('36.2304'),
        'phone': '+380572330001', 'email': 'kharkiv-center@autohub.ua',
    },
    {
        'name': 'AutoHub Харків Салтівка',
        'district': 'Салтівський',
        'address': 'просп. Тракторобудівників, 144',
        'latitude': Decimal('50.0319'), 'longitude': Decimal('36.3197'),
        'phone': '+380572330002', 'email': 'kharkiv-salt@autohub.ua',
    },
    {
        'name': 'AutoHub Харків Холодна Гора',
        'district': 'Холодногірський',
        'address': 'вул. Полтавський Шлях, 188',
        'latitude': Decimal('49.9824'), 'longitude': Decimal('36.1824'),
        'phone': '+380572330003', 'email': 'kharkiv-hg@autohub.ua',
    },

    {
        'name': 'AutoHub Одеса Центр',
        'district': 'Приморський',
        'address': 'вул. Дерибасівська, 14',
        'latitude': Decimal('46.4847'), 'longitude': Decimal('30.7326'),
        'phone': '+380482440001', 'email': 'odesa-center@autohub.ua',
    },
    {
        'name': 'AutoHub Одеса Таїровський',
        'district': 'Київський',
        'address': 'вул. Академіка Корольова, 33',
        'latitude': Decimal('46.4019'), 'longitude': Decimal('30.7158'),
        'phone': '+380482440002', 'email': 'odesa-tair@autohub.ua',
    },
    {
        'name': 'AutoHub Одеса Пересип',
        'district': 'Суворовський',
        'address': 'просп. Добровольського, 102',
        'latitude': Decimal('46.5345'), 'longitude': Decimal('30.7627'),
        'phone': '+380482440003', 'email': 'odesa-peresyp@autohub.ua',
    },
]

dealerships = []
for d in dealerships_data:
    obj, _ = Dealership.objects.update_or_create(name=d['name'], defaults=d)
    dealerships.append(obj)

catalog = {
    'Toyota': {
        'Camry': [('XV70', 2017, None)],
        'RAV4': [('XA50', 2018, None)],
        'Corolla': [('E210', 2018, None)],
        'Land Cruiser': [('300', 2021, None)],
    },
    'Volkswagen': {
        'Passat': [('B8', 2014, 2023)],
        'Tiguan': [('II', 2016, None)],
        'Golf': [('VIII', 2019, None)],
        'Touareg': [('III', 2018, None)],
    },
    'BMW': {
        '3 Series': [('G20', 2018, None)],
        '5 Series': [('G30', 2017, 2023)],
        'X5': [('G05', 2018, None)],
        'X3': [('G01', 2017, None)],
    },
    'Tesla': {
        'Model 3': [('Highland', 2023, None)],
        'Model Y': [('Y', 2020, None)],
        'Model S': [('Plaid', 2021, None)],
    },
    'Mercedes-Benz': {
        'C-Class': [('W206', 2021, None)],
        'E-Class': [('W213', 2016, 2023)],
        'GLE': [('V167', 2019, None)],
    },
    'Audi': {
        'A4': [('B9', 2015, None)],
        'A6': [('C8', 2018, None)],
        'Q5': [('FY', 2017, None)],
        'Q7': [('4M', 2015, None)],
    },
    'Honda': {
        'Civic': [('XI', 2021, None)],
        'CR-V': [('VI', 2022, None)],
    },
    'Hyundai': {
        'Tucson': [('NX4', 2020, None)],
        'Santa Fe': [('TM', 2018, None)],
        'Elantra': [('CN7', 2020, None)],
    },
    'Kia': {
        'Sportage': [('NQ5', 2021, None)],
        'Sorento': [('MQ4', 2020, None)],
        'K5': [('DL3', 2019, None)],
    },
    'Mazda': {
        'CX-5': [('KF', 2017, None)],
        'Mazda6': [('GJ', 2012, None)],
    },
    'Škoda': {
        'Octavia': [('IV', 2020, None)],
        'Kodiaq': [('NS7', 2016, None)],
        'Superb': [('B8', 2015, None)],
    },
    'Renault': {
        'Megane': [('IV', 2016, None)],
        'Duster': [('II', 2018, None)],
    },
}

generations = {}
for brand_name, models in catalog.items():
    brand, _ = Brand.objects.get_or_create(name=brand_name)
    for model_name, gens in models.items():
        car_model, _ = CarModel.objects.get_or_create(brand=brand, name=model_name)
        for gen_name, y_start, y_end in gens:
            gen, _ = Generation.objects.update_or_create(
                car_model=car_model,
                name=gen_name,
                defaults={'year_start': y_start, 'year_end': y_end},
            )
            generations[(brand_name, model_name)] = gen

cars_data = [
    {'gen': ('Toyota', 'Camry'), 'dealer_idx': 0, 'year': 2021, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.5', 'power_hp': 200, 'mileage_km': 45000, 'color': 'Чорний', 'avg_fuel_consumption': '7.5', 'price_uah': '950000.00'},
    {'gen': ('Toyota', 'RAV4'), 'dealer_idx': 1, 'year': 2023, 'body_type': 'crossover', 'fuel_type': 'hybrid', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '2.5', 'power_hp': 222, 'mileage_km': 0, 'color': 'Сріблястий', 'avg_fuel_consumption': '5.6', 'price_uah': '1450000.00'},
    {'gen': ('Volkswagen', 'Passat'), 'dealer_idx': 0, 'year': 2019, 'body_type': 'sedan', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 190, 'mileage_km': 78000, 'color': 'Білий', 'avg_fuel_consumption': '5.8', 'price_uah': '720000.00'},
    {'gen': ('Volkswagen', 'Tiguan'), 'dealer_idx': 2, 'year': 2022, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 180, 'mileage_km': 22000, 'color': 'Синій', 'avg_fuel_consumption': '8.2', 'price_uah': '1100000.00'},
    {'gen': ('BMW', '3 Series'), 'dealer_idx': 0, 'year': 2022, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 258, 'mileage_km': 18000, 'color': 'Чорний', 'avg_fuel_consumption': '7.1', 'price_uah': '1650000.00'},
    {'gen': ('BMW', 'X5'), 'dealer_idx': 1, 'year': 2024, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '3.0', 'power_hp': 340, 'mileage_km': 0, 'color': 'Графіт', 'avg_fuel_consumption': '7.8', 'price_uah': '3200000.00'},
    {'gen': ('Tesla', 'Model 3'), 'dealer_idx': 2, 'year': 2024, 'body_type': 'sedan', 'fuel_type': 'electric', 'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'new', 'engine_volume': '0.0', 'power_hp': 283, 'mileage_km': 0, 'color': 'Червоний', 'avg_fuel_consumption': '0.0', 'price_uah': '1850000.00'},
    {'gen': ('Toyota', 'Corolla'), 'dealer_idx': 3, 'year': 2022, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '1.6', 'power_hp': 132, 'mileage_km': 32000, 'color': 'Білий', 'avg_fuel_consumption': '6.4', 'price_uah': '680000.00'},
    {'gen': ('Toyota', 'Land Cruiser'), 'dealer_idx': 1, 'year': 2024, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '3.3', 'power_hp': 309, 'mileage_km': 0, 'color': 'Перлинно-білий', 'avg_fuel_consumption': '8.9', 'price_uah': '4500000.00'},
    {'gen': ('Mercedes-Benz', 'C-Class'), 'dealer_idx': 0, 'year': 2023, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'new', 'engine_volume': '2.0', 'power_hp': 258, 'mileage_km': 5000, 'color': 'Сріблястий', 'avg_fuel_consumption': '7.2', 'price_uah': '2100000.00'},
    {'gen': ('Mercedes-Benz', 'GLE'), 'dealer_idx': 3, 'year': 2022, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '3.0', 'power_hp': 286, 'mileage_km': 28000, 'color': 'Чорний', 'avg_fuel_consumption': '7.5', 'price_uah': '3100000.00'},
    {'gen': ('Audi', 'A6'), 'dealer_idx': 2, 'year': 2021, 'body_type': 'sedan', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 204, 'mileage_km': 42000, 'color': 'Синій', 'avg_fuel_consumption': '5.4', 'price_uah': '1750000.00'},
    {'gen': ('Audi', 'Q7'), 'dealer_idx': 0, 'year': 2023, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '3.0', 'power_hp': 286, 'mileage_km': 0, 'color': 'Сірий', 'avg_fuel_consumption': '7.8', 'price_uah': '3500000.00'},
    {'gen': ('Tesla', 'Model Y'), 'dealer_idx': 1, 'year': 2023, 'body_type': 'crossover', 'fuel_type': 'electric', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '0.0', 'power_hp': 384, 'mileage_km': 12000, 'color': 'Білий', 'avg_fuel_consumption': '0.0', 'price_uah': '2300000.00'},

    {'gen': ('Volkswagen', 'Golf'), 'dealer_idx': 4, 'year': 2021, 'body_type': 'hatchback', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '1.5', 'power_hp': 150, 'mileage_km': 38000, 'color': 'Червоний', 'avg_fuel_consumption': '6.2', 'price_uah': '780000.00'},
    {'gen': ('Volkswagen', 'Touareg'), 'dealer_idx': 5, 'year': 2022, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '3.0', 'power_hp': 286, 'mileage_km': 35000, 'color': 'Чорний', 'avg_fuel_consumption': '7.4', 'price_uah': '2400000.00'},
    {'gen': ('Škoda', 'Octavia'), 'dealer_idx': 4, 'year': 2022, 'body_type': 'liftback', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '1.5', 'power_hp': 150, 'mileage_km': 28000, 'color': 'Сріблястий', 'avg_fuel_consumption': '6.0', 'price_uah': '850000.00'},
    {'gen': ('Škoda', 'Kodiaq'), 'dealer_idx': 6, 'year': 2023, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '2.0', 'power_hp': 200, 'mileage_km': 0, 'color': 'Білий', 'avg_fuel_consumption': '6.8', 'price_uah': '1550000.00'},
    {'gen': ('Škoda', 'Superb'), 'dealer_idx': 5, 'year': 2020, 'body_type': 'sedan', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 190, 'mileage_km': 65000, 'color': 'Синій', 'avg_fuel_consumption': '5.6', 'price_uah': '900000.00'},
    {'gen': ('BMW', '5 Series'), 'dealer_idx': 4, 'year': 2020, 'body_type': 'sedan', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 231, 'mileage_km': 55000, 'color': 'Чорний', 'avg_fuel_consumption': '6.2', 'price_uah': '1850000.00'},
    {'gen': ('BMW', 'X3'), 'dealer_idx': 6, 'year': 2022, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 245, 'mileage_km': 24000, 'color': 'Сірий', 'avg_fuel_consumption': '7.6', 'price_uah': '1950000.00'},
    {'gen': ('Audi', 'A4'), 'dealer_idx': 4, 'year': 2019, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 190, 'mileage_km': 58000, 'color': 'Чорний', 'avg_fuel_consumption': '6.4', 'price_uah': '1050000.00'},
    {'gen': ('Audi', 'Q5'), 'dealer_idx': 5, 'year': 2021, 'body_type': 'crossover', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 204, 'mileage_km': 33000, 'color': 'Білий', 'avg_fuel_consumption': '6.0', 'price_uah': '1700000.00'},
    {'gen': ('Renault', 'Duster'), 'dealer_idx': 6, 'year': 2021, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'manual', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '1.6', 'power_hp': 114, 'mileage_km': 42000, 'color': 'Помаранчевий', 'avg_fuel_consumption': '7.8', 'price_uah': '480000.00'},
    {'gen': ('Renault', 'Megane'), 'dealer_idx': 4, 'year': 2018, 'body_type': 'hatchback', 'fuel_type': 'diesel', 'transmission': 'manual', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '1.5', 'power_hp': 110, 'mileage_km': 92000, 'color': 'Сірий', 'avg_fuel_consumption': '4.5', 'price_uah': '380000.00'},

    {'gen': ('Hyundai', 'Tucson'), 'dealer_idx': 7, 'year': 2022, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 156, 'mileage_km': 26000, 'color': 'Червоний', 'avg_fuel_consumption': '8.0', 'price_uah': '1050000.00'},
    {'gen': ('Hyundai', 'Santa Fe'), 'dealer_idx': 8, 'year': 2021, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.2', 'power_hp': 200, 'mileage_km': 48000, 'color': 'Чорний', 'avg_fuel_consumption': '7.0', 'price_uah': '1250000.00'},
    {'gen': ('Hyundai', 'Elantra'), 'dealer_idx': 7, 'year': 2023, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'new', 'engine_volume': '1.6', 'power_hp': 123, 'mileage_km': 0, 'color': 'Сірий', 'avg_fuel_consumption': '6.6', 'price_uah': '720000.00'},
    {'gen': ('Kia', 'Sportage'), 'dealer_idx': 9, 'year': 2023, 'body_type': 'crossover', 'fuel_type': 'hybrid', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '1.6', 'power_hp': 230, 'mileage_km': 0, 'color': 'Синій', 'avg_fuel_consumption': '5.4', 'price_uah': '1450000.00'},
    {'gen': ('Kia', 'Sorento'), 'dealer_idx': 8, 'year': 2022, 'body_type': 'suv', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.2', 'power_hp': 202, 'mileage_km': 32000, 'color': 'Білий', 'avg_fuel_consumption': '6.8', 'price_uah': '1380000.00'},
    {'gen': ('Kia', 'K5'), 'dealer_idx': 7, 'year': 2021, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 180, 'mileage_km': 40000, 'color': 'Чорний', 'avg_fuel_consumption': '7.4', 'price_uah': '880000.00'},
    {'gen': ('Honda', 'Civic'), 'dealer_idx': 9, 'year': 2022, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '1.5', 'power_hp': 182, 'mileage_km': 22000, 'color': 'Білий', 'avg_fuel_consumption': '6.6', 'price_uah': '950000.00'},
    {'gen': ('Honda', 'CR-V'), 'dealer_idx': 8, 'year': 2023, 'body_type': 'crossover', 'fuel_type': 'hybrid', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '2.0', 'power_hp': 207, 'mileage_km': 0, 'color': 'Срібло', 'avg_fuel_consumption': '5.8', 'price_uah': '1620000.00'},
    {'gen': ('Mazda', 'CX-5'), 'dealer_idx': 7, 'year': 2021, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.5', 'power_hp': 194, 'mileage_km': 36000, 'color': 'Червоний', 'avg_fuel_consumption': '7.8', 'price_uah': '1100000.00'},

    {'gen': ('Mercedes-Benz', 'E-Class'), 'dealer_idx': 10, 'year': 2020, 'body_type': 'sedan', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 194, 'mileage_km': 62000, 'color': 'Чорний', 'avg_fuel_consumption': '5.4', 'price_uah': '1750000.00'},
    {'gen': ('Tesla', 'Model S'), 'dealer_idx': 10, 'year': 2023, 'body_type': 'sedan', 'fuel_type': 'electric', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '0.0', 'power_hp': 670, 'mileage_km': 0, 'color': 'Чорний', 'avg_fuel_consumption': '0.0', 'price_uah': '4200000.00'},
    {'gen': ('Tesla', 'Model 3'), 'dealer_idx': 11, 'year': 2022, 'body_type': 'sedan', 'fuel_type': 'electric', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '0.0', 'power_hp': 351, 'mileage_km': 18000, 'color': 'Білий', 'avg_fuel_consumption': '0.0', 'price_uah': '1650000.00'},
    {'gen': ('Toyota', 'RAV4'), 'dealer_idx': 12, 'year': 2021, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 175, 'mileage_km': 38000, 'color': 'Сірий', 'avg_fuel_consumption': '7.2', 'price_uah': '1180000.00'},
    {'gen': ('BMW', 'X5'), 'dealer_idx': 10, 'year': 2021, 'body_type': 'suv', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '3.0', 'power_hp': 340, 'mileage_km': 28000, 'color': 'Білий', 'avg_fuel_consumption': '9.2', 'price_uah': '2750000.00'},
    {'gen': ('BMW', '3 Series'), 'dealer_idx': 11, 'year': 2020, 'body_type': 'sedan', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'rwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 190, 'mileage_km': 52000, 'color': 'Сріблястий', 'avg_fuel_consumption': '5.0', 'price_uah': '1320000.00'},
    {'gen': ('Audi', 'Q5'), 'dealer_idx': 12, 'year': 2022, 'body_type': 'crossover', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 249, 'mileage_km': 24000, 'color': 'Чорний', 'avg_fuel_consumption': '7.6', 'price_uah': '1850000.00'},
    {'gen': ('Mazda', 'Mazda6'), 'dealer_idx': 11, 'year': 2019, 'body_type': 'sedan', 'fuel_type': 'petrol', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.5', 'power_hp': 194, 'mileage_km': 68000, 'color': 'Червоний', 'avg_fuel_consumption': '7.4', 'price_uah': '720000.00'},
    {'gen': ('Hyundai', 'Tucson'), 'dealer_idx': 12, 'year': 2023, 'body_type': 'crossover', 'fuel_type': 'hybrid', 'transmission': 'automatic', 'drive_type': 'awd', 'condition': 'new', 'engine_volume': '1.6', 'power_hp': 230, 'mileage_km': 0, 'color': 'Темно-синій', 'avg_fuel_consumption': '5.6', 'price_uah': '1380000.00'},
    {'gen': ('Volkswagen', 'Tiguan'), 'dealer_idx': 10, 'year': 2020, 'body_type': 'crossover', 'fuel_type': 'diesel', 'transmission': 'automatic', 'drive_type': 'fwd', 'condition': 'used', 'engine_volume': '2.0', 'power_hp': 150, 'mileage_km': 72000, 'color': 'Сірий', 'avg_fuel_consumption': '5.8', 'price_uah': '850000.00'},
]

for c in cars_data:
    gen = generations[c['gen']]
    dealer = dealerships[c['dealer_idx']]
    Car.objects.update_or_create(
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

# Safety check: warn if duplicate cars exist with the same key.
from django.db.models import Count as _Count
_dups = Car.objects.values('generation_id', 'dealership_id', 'year', 'color').annotate(n=_Count('id')).filter(n__gt=1)
if _dups:
    print('WARNING: duplicate cars detected (same generation+dealership+year+color):')
    for d in _dups:
        ids = list(Car.objects.filter(
            generation_id=d['generation_id'], dealership_id=d['dealership_id'],
            year=d['year'], color=d['color'],
        ).values_list('id', flat=True))
        print(f'  ids={ids} {d}')
    print('Resolve manually before re-seeding.')

print(f'Users: {User.objects.count()}')
print(f'Dealerships: {Dealership.objects.count()}')
print(f'Brands: {Brand.objects.count()}, Models: {CarModel.objects.count()}, Generations: {Generation.objects.count()}')
print(f'Cars: {Car.objects.count()}')
