from django.contrib import admin
from .models import TestDriveBooking

@admin.register(TestDriveBooking)
class TestDriveBookingAdmin(admin.ModelAdmin):
    list_display = ('user', 'car', 'dealership', 'booking_datetime', 'status')
    list_filter = ('status', 'dealership')
    list_editable = ('status',)
    ordering = ('-booking_datetime',)
