from functools import reduce
import operator
import unicodedata

from rest_framework import viewsets, permissions, decorators, response, mixins, filters
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Value
from django.db.models.functions import Replace

from .models import Brand, Car, Favorite
from .serializers import BrandSerializer, CarListSerializer, CarDetailSerializer, FavoriteSerializer
from .filters import CarFilter


def _deaccent(s):
    return ''.join(c for c in unicodedata.normalize('NFD', s) if unicodedata.category(c) != 'Mn')


class DeaccentSearchFilter(filters.SearchFilter):
    """SearchFilter that also matches diacritic-insensitive forms (e.g. 'Skoda' → 'Škoda')."""

    def filter_queryset(self, request, queryset, view):
        terms = self.get_search_terms(request)
        search_fields = self.get_search_fields(view, request)
        if not terms or not search_fields:
            return queryset

        qs = queryset.annotate(
            _brand_ascii=Replace(
                Replace('generation__car_model__brand__name', Value('Š'), Value('S')),
                Value('š'), Value('s'),
            ),
            _model_ascii=Replace(
                Replace('generation__car_model__name', Value('Š'), Value('S')),
                Value('š'), Value('s'),
            ),
        )

        conds = []
        for term in terms:
            t = _deaccent(term)
            term_q = Q(_brand_ascii__icontains=t) | Q(_model_ascii__icontains=t)
            for field in search_fields:
                term_q |= Q(**{f'{field}__icontains': term})
            conds.append(term_q)
        return qs.filter(reduce(operator.and_, conds))


class BrandViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (permissions.AllowAny,)


class CarViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Car.objects.select_related('generation__car_model__brand', 'dealership').prefetch_related('images')
    permission_classes = (permissions.AllowAny,)
    filterset_class = CarFilter
    filter_backends = [DjangoFilterBackend, DeaccentSearchFilter, filters.OrderingFilter]
    search_fields = ['color']
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


class FavoriteViewSet(mixins.ListModelMixin,
                      mixins.CreateModelMixin,
                      mixins.DestroyModelMixin,
                      viewsets.GenericViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = (permissions.IsAuthenticated,)
    pagination_class = None

    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user).select_related(
            'car__generation__car_model__brand', 'car__dealership'
        )

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        favorite, _ = Favorite.objects.get_or_create(
            user=request.user, car=serializer.validated_data['car']
        )
        return response.Response(self.get_serializer(favorite).data, status=201)
