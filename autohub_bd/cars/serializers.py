from rest_framework import serializers
from .models import Brand, CarModel, Generation, Car, CarImage, Favorite


class CarImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = CarImage
        fields = ('id', 'image', 'is_main', 'order')


class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = ('id', 'name')


class CarListSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='generation.car_model.brand.name', read_only=True)
    model_name = serializers.CharField(source='generation.car_model.name', read_only=True)
    generation_name = serializers.CharField(source='generation.name', read_only=True)
    dealership_name = serializers.CharField(source='dealership.name', read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    body_type_display = serializers.CharField(source='get_body_type_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Car
        fields = (
            'id', 'brand_name', 'model_name', 'generation_name',
            'year', 'body_type', 'body_type_display',
            'fuel_type', 'fuel_type_display',
            'mileage_km', 'condition', 'price_uah',
            'status', 'status_display', 'dealership_name',
        )


class FavoriteSerializer(serializers.ModelSerializer):
    car = CarListSerializer(read_only=True)
    car_id = serializers.PrimaryKeyRelatedField(queryset=Car.objects.all(), source='car', write_only=True)

    class Meta:
        model = Favorite
        fields = ('id', 'car', 'car_id', 'created_at')
        read_only_fields = ('id', 'created_at')


class CarDetailSerializer(serializers.ModelSerializer):
    brand_name = serializers.CharField(source='generation.car_model.brand.name', read_only=True)
    model_name = serializers.CharField(source='generation.car_model.name', read_only=True)
    generation_name = serializers.CharField(source='generation.name', read_only=True)
    images = CarImageSerializer(many=True, read_only=True)
    fuel_type_display = serializers.CharField(source='get_fuel_type_display', read_only=True)
    body_type_display = serializers.CharField(source='get_body_type_display', read_only=True)
    transmission_display = serializers.CharField(source='get_transmission_display', read_only=True)
    drive_type_display = serializers.CharField(source='get_drive_type_display', read_only=True)
    condition_display = serializers.CharField(source='get_condition_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    dealership_name = serializers.CharField(source='dealership.name', read_only=True)
    dealership_address = serializers.CharField(source='dealership.address', read_only=True)
    dealership_phone = serializers.CharField(source='dealership.phone', read_only=True)

    class Meta:
        model = Car
        fields = '__all__'
