import django_filters
from .models import Car


class CarFilter(django_filters.FilterSet):
    brand = django_filters.CharFilter(field_name='generation__car_model__brand__name', lookup_expr='iexact')
    car_model = django_filters.CharFilter(field_name='generation__car_model__name', lookup_expr='iexact')
    year_min = django_filters.NumberFilter(field_name='year', lookup_expr='gte')
    year_max = django_filters.NumberFilter(field_name='year', lookup_expr='lte')
    price_min = django_filters.NumberFilter(field_name='price_uah', lookup_expr='gte')
    price_max = django_filters.NumberFilter(field_name='price_uah', lookup_expr='lte')
    mileage_max = django_filters.NumberFilter(field_name='mileage_km', lookup_expr='lte')
    dealership = django_filters.NumberFilter(field_name='dealership__id')

    class Meta:
        model = Car
        fields = ['brand', 'car_model', 'body_type', 'fuel_type', 'transmission', 'drive_type', 'condition', 'status', 'year_min', 'year_max', 'price_min', 'price_max', 'mileage_max', 'dealership']
