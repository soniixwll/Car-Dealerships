from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser


def _validate_phone(value):
    phone = (value or '').strip()
    if not phone:
        return phone
    if not phone.startswith('+380') or len(phone) != 13 or not phone[1:].isdigit():
        raise serializers.ValidationError('Введіть номер у форматі +380XXXXXXXXX')
    return phone


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = ('email', 'username', 'password', 'password2', 'phone')
        extra_kwargs = {
            'username': {'min_length': 3, 'max_length': 30},
        }

    def validate_email(self, value):
        normalized = value.strip().lower()
        if CustomUser.objects.filter(email__iexact=normalized).exists():
            raise serializers.ValidationError('Користувач з таким email вже існує')
        return normalized

    def validate_username(self, value):
        username = value.strip()
        if CustomUser.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError('Це імʼя користувача вже зайняте')
        return username

    def validate_phone(self, value):
        return _validate_phone(value)

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Паролі не співпадають'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        user = CustomUser.objects.create_user(**validated_data)
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('id', 'email', 'username', 'phone', 'role')
        read_only_fields = ('id', 'email', 'role')

    def validate_phone(self, value):
        return _validate_phone(value)

    def validate_username(self, value):
        username = value.strip()
        qs = CustomUser.objects.filter(username__iexact=username)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError('Це імʼя користувача вже зайняте')
        return username


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['role'] = self.user.role
        data['email'] = self.user.email
        data['username'] = self.user.username
        return data
