from django.core.cache import cache
from rest_framework.test import APITestCase
from rest_framework import status
from .models import CustomUser


class ThrottleResetMixin:
    def setUp(self):
        cache.clear()
        super().setUp()


# Re-exported for other apps to share the cache-clearing setUp.
NO_THROTTLE = ThrottleResetMixin


class AuthFlowTests(ThrottleResetMixin, APITestCase):
    def test_register_login_refresh_logout(self):
        r = self.client.post('/api/auth/register/', {
            'email': 'alice@example.com',
            'username': 'alice',
            'password': 'StrongPass!2026',
            'password2': 'StrongPass!2026',
            'phone': '+380671112233',
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_201_CREATED, r.content)
        self.assertTrue(CustomUser.objects.filter(email='alice@example.com').exists())

        r = self.client.post('/api/auth/login/', {
            'email': 'alice@example.com',
            'password': 'StrongPass!2026',
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        access = r.data['access']
        refresh = r.data['refresh']
        self.assertEqual(r.data['email'], 'alice@example.com')

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')
        r = self.client.get('/api/auth/profile/')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        self.assertEqual(r.data['email'], 'alice@example.com')

        self.client.credentials()
        r = self.client.post('/api/auth/token/refresh/', {'refresh': refresh}, format='json')
        self.assertEqual(r.status_code, status.HTTP_200_OK)
        new_refresh = r.data['refresh']
        new_access = r.data['access']

        r2 = self.client.post('/api/auth/token/refresh/', {'refresh': refresh}, format='json')
        self.assertEqual(r2.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {new_access}')
        r = self.client.post('/api/auth/logout/', {'refresh': new_refresh}, format='json')
        self.assertEqual(r.status_code, status.HTTP_205_RESET_CONTENT)

        self.client.credentials()
        r = self.client.post('/api/auth/token/refresh/', {'refresh': new_refresh}, format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_register_rejects_duplicate_email(self):
        CustomUser.objects.create_user(email='dup@example.com', username='dup', password='x')
        r = self.client.post('/api/auth/register/', {
            'email': 'dup@example.com',
            'username': 'dup2',
            'password': 'StrongPass!2026',
            'password2': 'StrongPass!2026',
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_rejects_phone_format(self):
        r = self.client.post('/api/auth/register/', {
            'email': 'bad@example.com',
            'username': 'bad',
            'password': 'StrongPass!2026',
            'password2': 'StrongPass!2026',
            'phone': '0671112233',
        }, format='json')
        self.assertEqual(r.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('phone', r.data)

    def test_login_invalid_returns_401(self):
        CustomUser.objects.create_user(email='x@x.com', username='x', password='RealPass!2026')
        r = self.client.post('/api/auth/login/', {'email': 'x@x.com', 'password': 'wrong'}, format='json')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_requires_auth(self):
        r = self.client.get('/api/auth/profile/')
        self.assertEqual(r.status_code, status.HTTP_401_UNAUTHORIZED)
