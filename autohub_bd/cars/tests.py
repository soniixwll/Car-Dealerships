from rest_framework.test import APITestCase
from rest_framework import status
from users.models import CustomUser
from users.tests import ThrottleResetMixin
from .models import Favorite
from .test_factory import make_car


class CarsApiTests(ThrottleResetMixin, APITestCase):
    def test_list_is_public_and_paginated(self):
        for i in range(15):
            make_car(model_name=f'Model{i}', mileage_km=i * 1000)
        r = self.client.get('/api/cars/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 15)
        self.assertEqual(len(r.data['results']), 12)
        self.assertIsNotNone(r.data['next'])

    def test_filter_by_brand(self):
        make_car(brand_name='Toyota')
        make_car(brand_name='Honda', model_name='Civic')
        r = self.client.get('/api/cars/?brand=Toyota')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['count'], 1)
        self.assertEqual(r.data['results'][0]['brand_name'], 'Toyota')

    def test_detail_endpoint(self):
        car = make_car()
        r = self.client.get(f'/api/cars/{car.id}/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['id'], car.id)


class FavoritesTests(ThrottleResetMixin, APITestCase):
    def setUp(self):
        super().setUp()
        self.user = CustomUser.objects.create_user(email='fan@example.com', username='fan', password='Strong!2026')
        self.car = make_car()
        r = self.client.post('/api/auth/login/', {'email': 'fan@example.com', 'password': 'Strong!2026'}, format='json')
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {r.data["access"]}')

    def test_favorites_require_auth(self):
        self.client.credentials()
        r = self.client.get('/api/cars/favorites/')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_add_then_list_then_remove(self):
        r = self.client.post('/api/cars/favorites/', {'car_id': self.car.id}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        fav_id = r.data['id']

        r = self.client.get('/api/cars/favorites/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(len(r.data), 1)

        r = self.client.delete(f'/api/cars/favorites/{fav_id}/')
        self.assertEqual(r.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Favorite.objects.count(), 0)

    def test_add_same_car_is_idempotent(self):
        self.client.post('/api/cars/favorites/', {'car_id': self.car.id}, format='json')
        r = self.client.post('/api/cars/favorites/', {'car_id': self.car.id}, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Favorite.objects.filter(user=self.user, car=self.car).count(), 1)
