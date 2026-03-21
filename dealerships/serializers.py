from rest_framework import serializers
from .models import Dealership


class DealershipSerializer(serializers.ModelSerializer):
    cars_count = serializers.SerializerMethodField()

    class Meta:
        model = Dealership
        fields = '__all__'

    def get_cars_count(self, obj):
        return obj.cars.filter(status='available').count()
