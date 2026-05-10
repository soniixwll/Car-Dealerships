from decimal import Decimal
from cars.models import Brand, CarModel, Generation, Car
from dealerships.models import Dealership


def make_car(brand_name='TestBrand', model_name='TestModel', dealership=None, **overrides):
    brand, _ = Brand.objects.get_or_create(name=brand_name)
    model, _ = CarModel.objects.get_or_create(brand=brand, name=model_name)
    gen, _ = Generation.objects.get_or_create(car_model=model, name='I', defaults={'year_start': 2020})
    if dealership is None:
        dealership, _ = Dealership.objects.get_or_create(
            name='AutoHub Test', defaults={
                'district': 'Центр', 'address': 'вул. Тестова 1',
                'phone': '+380440000000', 'email': 'test@autohub.test',
            },
        )
    defaults = {
        'generation': gen, 'dealership': dealership,
        'year': 2023, 'body_type': Car.BodyType.SEDAN, 'fuel_type': Car.FuelType.PETROL,
        'transmission': Car.Transmission.AUTOMATIC, 'drive_type': Car.DriveType.FWD,
        'condition': Car.Condition.NEW, 'engine_volume': Decimal('2.0'),
        'power_hp': 150, 'mileage_km': 0, 'color': 'White',
        'avg_fuel_consumption': Decimal('7.5'), 'price_uah': Decimal('1000000'),
    }
    defaults.update(overrides)
    return Car.objects.create(**defaults)
