from rest_framework import viewsets, permissions
from .models import Dealership
from .serializers import DealershipSerializer


class DealershipViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Dealership.objects.filter(is_active=True)
    serializer_class = DealershipSerializer
    permission_classes = (permissions.AllowAny,)
