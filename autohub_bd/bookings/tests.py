from datetime import timedelta
from django.utils import timezone
from rest_framework.test import APITestCase
from rest_framework import status
from users.models import CustomUser
from users.tests import ThrottleResetMixin
from cars.test_factory import make_car
from dealerships.models import Dealership
from .models import TestDriveBooking


class BookingTests(ThrottleResetMixin, APITestCase):
    def setUp(self):
        super().setUp()
        self.user = CustomUser.objects.create_user(email='b@example.com', username='b', password='Strong!2026')
        self.car = make_car()
        r = self.client.post('/api/auth/login/', {'email': 'b@example.com', 'password': 'Strong!2026'}, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {r.data["access"]}')
        self.future = (timezone.now() + timedelta(days=2)).replace(microsecond=0).isoformat()

    def _payload(self, **overrides):
        p = {
            'car': self.car.id,
            'dealership': self.car.dealership_id,
            'booking_datetime': self.future,
            'phone': '+380671112233',
            'comment': '',
        }
        p.update(overrides)
        return p

    def test_create_booking_requires_auth(self):
        self.client.credentials()
        r = self.client.post('/api/bookings/', self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_booking_happy_path(self):
        r = self.client.post('/api/bookings/', self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.content)
        self.assertEqual(TestDriveBooking.objects.count(), 1)

    def test_phone_validation(self):
        r = self.client.post('/api/bookings/', self._payload(phone='0671112233'), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', r.data)

    def test_past_datetime_rejected(self):
        past = (timezone.now() - timedelta(days=1)).replace(microsecond=0).isoformat()
        r = self.client.post('/api/bookings/', self._payload(booking_datetime=past), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_dealership_must_match_car(self):
        other = Dealership.objects.create(name='Other', district='Х', address='вул. Інша 2', phone='+380440000001', email='other@x.test')
        r = self.client.post('/api/bookings/', self._payload(dealership=other.id), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('dealership', r.data)

    def test_slot_taken_rejected(self):
        self.client.post('/api/bookings/', self._payload(), format='json')
        r = self.client.post('/api/bookings/', self._payload(), format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        keys = set(r.data.keys())
        self.assertTrue(keys & {'booking_datetime', 'non_field_errors'},
                        f'Expected slot-taken error, got {r.data}')

    def test_availability_endpoint(self):
        self.client.post('/api/bookings/', self._payload(), format='json')
        date = self.future.split('T')[0]
        self.client.credentials()
        r = self.client.get(f'/api/bookings/availability/?car={self.car.id}&date={date}')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data['taken_times']), 1)
