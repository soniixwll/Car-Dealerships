from rest_framework import viewsets, permissions, decorators, response
from .models import Brand, Car
from .serializers import BrandSerializer, CarListSerializer, CarDetailSerializer
from .filters import CarFilter


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (permissions.AllowAny,)


class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.select_related('generation__car_model__brand', 'dealership').prefetch_related('images')
    permission_classes = (permissions.AllowAny,)
    filterset_class = CarFilter
    search_fields = ['generation__car_model__brand__name', 'generation__car_model__name', 'color']
    ordering_fields = ['price_uah', 'year', 'mileage_km', 'created_at']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CarDetailSerializer
        return CarListSerializer

    @decorators.action(detail=True, methods=['get'])
    def calculate(self, request, pk=None):
        car = self.get_object()
        try:
            monthly_km = float(request.query_params.get('monthly_km', 1500))
            fuel_price = float(request.query_params.get('fuel_price', 55))
        except ValueError:
            return response.Response({'error': 'Невірні параметри'}, status=400)

        fuel_monthly = (float(car.avg_fuel_consumption) / 100) * monthly_km * fuel_price
        to_monthly = (monthly_km * 12 / 10000 * 3500) / 12

        engine = float(car.engine_volume)
        if car.fuel_type == 'electric':
            annual_tax = 0
        elif engine <= 1.5:
            annual_tax = 2500
        elif engine <= 2.0:
            annual_tax = 5000
        elif engine <= 3.0:
            annual_tax = 10000
        else:
            annual_tax = 20000

        tax_monthly = annual_tax / 12
        total_monthly = fuel_monthly + to_monthly + tax_monthly

        return response.Response({
            'monthly_km': monthly_km,
            'fuel_price': fuel_price,
            'breakdown': {
                'fuel_monthly': round(fuel_monthly, 2),
                'maintenance_monthly': round(to_monthly, 2),
                'tax_monthly': round(tax_monthly, 2),
            },
            'total_monthly': round(total_monthly, 2),
            'total_annual': round(total_monthly * 12, 2),
        })
