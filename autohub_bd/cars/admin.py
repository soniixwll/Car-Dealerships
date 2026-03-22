from django.contrib import admin
from .models import Brand, CarModel, Generation, Car, CarImage

class CarImageInline(admin.TabularInline):
    model = CarImage
    extra = 3

@admin.register(Brand)
class BrandAdmin(admin.ModelAdmin):
    list_display = ('name',)
    search_fields = ('name',)

@admin.register(CarModel)
class CarModelAdmin(admin.ModelAdmin):
    list_display = ('brand', 'name')
    list_filter = ('brand',)

@admin.register(Generation)
class GenerationAdmin(admin.ModelAdmin):
    list_display = ('car_model', 'name', 'year_start', 'year_end')

@admin.register(Car)
class CarAdmin(admin.ModelAdmin):
    list_display = ('generation', 'year', 'dealership', 'fuel_type', 'condition', 'price_uah', 'status')
    list_filter = ('dealership', 'status', 'condition', 'fuel_type', 'body_type')
    list_editable = ('status',)
    inlines = [CarImageInline]
