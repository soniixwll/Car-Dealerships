from django.conf import settings
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes, throttle_classes
from rest_framework.response import Response
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from google.oauth2 import id_token as google_id_token
from google.auth.transport import requests as google_requests
from .models import CustomUser
from .serializers import RegisterSerializer, UserProfileSerializer, CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = (permissions.AllowAny,)
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'register'


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    throttle_classes = (ScopedRateThrottle,)
    throttle_scope = 'auth'


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class LogoutView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        refresh = request.data.get('refresh')
        if not refresh:
            return Response({'detail': 'refresh is required'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            RefreshToken(refresh).blacklist()
        except TokenError:
            return Response({'detail': 'Invalid or expired token'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(status=status.HTTP_205_RESET_CONTENT)


def _unique_username(base):
    base = (base or 'user').strip().replace(' ', '_').lower()[:30] or 'user'
    candidate = base
    suffix = 1
    while CustomUser.objects.filter(username=candidate).exists():
        suffix += 1
        candidate = f'{base}{suffix}'[:30]
    return candidate


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
@throttle_classes([ScopedRateThrottle])
def google_login(request):
    token = request.data.get('id_token') or request.data.get('credential')
    if not token:
        return Response({'detail': 'id_token is required'}, status=status.HTTP_400_BAD_REQUEST)
    if not settings.GOOGLE_OAUTH_CLIENT_ID:
        return Response({'detail': 'Google OAuth is not configured on server'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    try:
        idinfo = google_id_token.verify_oauth2_token(
            token, google_requests.Request(), settings.GOOGLE_OAUTH_CLIENT_ID
        )
    except ValueError:
        return Response({'detail': 'Invalid Google token'}, status=status.HTTP_400_BAD_REQUEST)

    email = idinfo.get('email')
    if not email or not idinfo.get('email_verified'):
        return Response({'detail': 'Google account email is not verified'}, status=status.HTTP_400_BAD_REQUEST)

    user = CustomUser.objects.filter(email=email).first()
    if not user:
        user = CustomUser.objects.create_user(
            email=email,
            username=_unique_username(idinfo.get('name') or email.split('@')[0]),
            first_name=idinfo.get('given_name', ''),
            last_name=idinfo.get('family_name', ''),
        )
        user.set_unusable_password()
        user.save()

    refresh = RefreshToken.for_user(user)
    return Response({
        'access': str(refresh.access_token),
        'refresh': str(refresh),
        'email': user.email,
        'username': user.username,
        'role': user.role,
    })


google_login.throttle_scope = 'auth'
