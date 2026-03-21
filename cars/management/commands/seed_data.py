from django.core.management.base import BaseCommand
from dealerships.models import Dealership
from cars.models import Brand, CarModel, Generation, Car

DEALERSHIPS = [
    {
        'name': 'AutoHub Центр',
        'district': 'Центр',
        'address': 'вул. Городоцька, 214, Львів',
        'latitude': 49.8397,
        'longitude': 24.0297,
        'phone': '+380 32 200-01-01',
        'email': 'center@autohub.lviv.ua',
        'working_hours': 'Пн-Сб: 9:00–19:00, Нд: 10:00–17:00',
    },
    {
        'name': 'AutoHub Сихів',
        'district': 'Сихів',
        'address': 'вул. Хуторівка, 35, Львів',
        'latitude': 49.7972,
        'longitude': 24.0567,
        'phone': '+380 32 200-02-02',
        'email': 'sykhiv@autohub.lviv.ua',
        'working_hours': 'Пн-Сб: 9:00–19:00, Нд: 10:00–16:00',
    },
    {
        'name': 'AutoHub Залізничний',
        'district': 'Залізничний',
        'address': 'вул. Героїв УПА, 73, Львів',
        'latitude': 49.8271,
        'longitude': 23.9825,
        'phone': '+380 32 200-03-03',
        'email': 'zaliznychnyi@autohub.lviv.ua',
        'working_hours': 'Пн-Сб: 9:00–18:00',
    },
]

CATALOG = [
    ('Volkswagen', 'Golf',     'VIII',  2020, None),
    ('Volkswagen', 'Passat',   'B8',    2015, None),
    ('Toyota',     'Camry',    'XV70',  2018, None),
    ('Toyota',     'RAV4',     'V',     2019, None),
    ('BMW',        '3 Series', 'G20',   2019, None),
    ('BMW',        'X5',       'G05',   2018, None),
    ('Mercedes',   'C-Class',  'W206',  2021, None),
    ('Renault',    'Megane',   'IV',    2016, None),
    ('Mazda',      'CX-5',     'II',    2017, None),
    ('Ford',       'Focus',    'IV',    2018, None),
    ('Skoda',      'Octavia',  'IV',    2020, None),
    ('Hyundai',    'Tucson',   'IV',    2021, None),
    ('Kia',        'Sportage', 'V',     2021, None),
    ('Audi',       'A4',       'B9',    2016, None),
    ('Honda',      'CR-V',     'V',     2017, None),
]

SAMPLE_CARS = [
    (0,  0, 2022, 'hatchback', 'petrol',   'robot',     'fwd', 'new',  1.5, 150,      0, 'Білий',    6.5,  950000),
    (0,  1, 2020, 'hatchback', 'diesel',   'manual',    'fwd', 'used', 2.0, 115,  45000, 'Сірий',    5.2,  700000),
    (1,  0, 2021, 'sedan',     'petrol',   'automatic', 'fwd', 'new',  1.5, 150,      0, 'Чорний',   7.2, 1100000),
    (2,  2, 2023, 'sedan',     'hybrid',   'automatic', 'fwd', 'new',  2.5, 218,      0, 'Білий',    6.0, 1450000),
    (3,  1, 2022, 'crossover', 'petrol',   'automatic', 'awd', 'new',  2.0, 175,      0, 'Червоний', 8.1, 1650000),
    (3,  2, 2020, 'crossover', 'diesel',   'automatic', 'awd', 'used', 2.0, 143,  38000, 'Синій',    6.8, 1250000),
    (4,  0, 2022, 'sedan',     'petrol',   'automatic', 'rwd', 'new',  2.0, 204,      0, 'Чорний',   8.5, 2200000),
    (5,  1, 2021, 'suv',       'diesel',   'automatic', 'awd', 'new',  3.0, 249,      0, 'Бежевий',  7.8, 3500000),
    (6,  0, 2023, 'sedan',     'petrol',   'automatic', 'rwd', 'new',  1.5, 170,      0, 'Білий',    7.0, 2100000),
    (7,  2, 2021, 'hatchback', 'electric', 'automatic', 'fwd', 'new',  0.0, 135,      0, 'Синій',    0.0, 1350000),
    (8,  1, 2022, 'crossover', 'petrol',   'automatic', 'awd', 'new',  2.5, 188,      0, 'Срібний',  8.3, 1550000),
    (9,  0, 2022, 'hatchback', 'petrol',   'manual',    'fwd', 'new',  1.5, 123,      0, 'Білий',    6.8,  870000),
    (10, 1, 2023, 'wagon',     'petrol',   'automatic', 'fwd', 'new',  1.5, 150,      0, 'Сірий',    6.2, 1050000),
    (11, 2, 2022, 'crossover', 'petrol',   'automatic', 'awd', 'new',  1.6, 150,      0, 'Синій',    7.5, 1200000),
    (12, 0, 2023, 'crossover', 'hybrid',   'automatic', 'awd', 'new',  1.6, 230,      0, 'Білий',    6.0, 1380000),
    (13, 1, 2022, 'sedan',     'petrol',   'automatic', 'fwd', 'new',  2.0, 190,      0, 'Чорний',   8.2, 1950000),
    (14, 2, 2021, 'crossover', 'petrol',   'cvt',       'awd', 'used', 1.5, 193,  31000, 'Сріблястий',7.4,1100000),
]


class Command(BaseCommand):
    help = 'Заповнити базу тестовими даними'

    def handle(self, *args, **kwargs):
        self.stdout.write('Створення салонів...')
        dealerships = []
        for d in DEALERSHIPS:
            obj, created = Dealership.objects.get_or_create(name=d['name'], defaults=d)
            dealerships.append(obj)
            self.stdout.write(f'  {obj.name} — {"створено" if created else "вже існує"}')

        self.stdout.write('Створення марок і моделей...')
        generations = []
        for brand_name, model_name, gen_name, y_start, y_end in CATALOG:
            brand, _ = Brand.objects.get_or_create(name=brand_name)
            car_model, _ = CarModel.objects.get_or_create(brand=brand, name=model_name)
            gen, _ = Generation.objects.get_or_create(
                car_model=car_model, name=gen_name,
                defaults={'year_start': y_start, 'year_end': y_end}
            )
            generations.append(gen)

        self.stdout.write('Додавання авто...')
        count = 0
        for row in SAMPLE_CARS:
            gen_i, deal_i, year, body, fuel, trans, drive, cond, engine, power, mileage, color, consumption, price = row
            car, created = Car.objects.get_or_create(
                generation=generations[gen_i],
                dealership=dealerships[deal_i],
                year=year, color=color,
                defaults=dict(
                    body_type=body, fuel_type=fuel, transmission=trans,
                    drive_type=drive, condition=cond, engine_volume=engine,
                    power_hp=power, mileage_km=mileage,
                    avg_fuel_consumption=consumption, price_uah=price,
                    status='available',
                )
            )
            if created:
                count += 1

        self.stdout.write(self.style.SUCCESS(f'\nГотово! Створено 3 салони і {count} авто.'))
