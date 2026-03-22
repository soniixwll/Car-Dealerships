from django.contrib import admin
from .models import Dealership

@admin.register(Dealership)
class DealershipAdmin(admin.ModelAdmin):
    list_display = ('name', 'district', 'address', 'phone', 'is_active')
    list_editable = ('is_active',)
    search_fields = ('name', 'address')
