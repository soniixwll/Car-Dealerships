import axios from 'axios';
import toast from 'react-hot-toast';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'ngrok-skip-browser-warning': 'true' },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refresh');
  localStorage.removeItem('user');
};

let refreshing = null;

const refreshAccessToken = () => {
  if (refreshing) return refreshing;
  const refresh = localStorage.getItem('refresh');
  if (!refresh) return Promise.reject(new Error('No refresh token'));

  refreshing = axios
    .post(`${api.defaults.baseURL}/auth/token/refresh/`, { refresh }, {
      headers: { 'ngrok-skip-browser-warning': 'true' },
    })
    .then(r => {
      localStorage.setItem('token', r.data.access);
      if (r.data.refresh) localStorage.setItem('refresh', r.data.refresh);
      return r.data.access;
    })
    .finally(() => { refreshing = null; });

  return refreshing;
};

const isAuthEndpoint = (url = '') =>
  url.includes('/auth/login') ||
  url.includes('/auth/register') ||
  url.includes('/auth/google') ||
  url.includes('/auth/token/refresh');

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;
    const status = err.response?.status;

    if (status === 401 && original && !original._retried && !isAuthEndpoint(original.url)) {
      original._retried = true;
      try {
        const access = await refreshAccessToken();
        original.headers.Authorization = `Bearer ${access}`;
        return api(original);
      } catch {
        clearAuth();
        if (window.location.pathname !== '/login') {
          toast.error('Сесія завершилась. Увійдіть знову.');
          window.location.assign('/login');
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export const getCars = (params) => api.get('/cars/', { params });
export const getCar = (id) => api.get(`/cars/${id}/`);
export const getBrands = () => api.get('/cars/brands/');
export const getDealerships = () => api.get('/dealerships/');
export const getDealership = (id) => api.get(`/dealerships/${id}/`);
export const calculateCost = (id, params) => api.get(`/cars/${id}/calculate/`, { params });
export const login = (data) => api.post('/auth/login/', data);
export const register = (data) => api.post('/auth/register/', data);
export const googleLogin = (idToken) => api.post('/auth/google/', { id_token: idToken });
export const logoutApi = (refresh) => api.post('/auth/logout/', { refresh });
export const getProfile = () => api.get('/auth/profile/');
export const updateProfile = (data) => api.patch('/auth/profile/', data);
export const getBookings = () => api.get('/bookings/');
export const createBooking = (data) => api.post('/bookings/', data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}/`);
export const getAvailability = (carId, date) => api.get('/bookings/availability/', { params: { car: carId, date } });
export const getFavorites = () => api.get('/cars/favorites/');
export const addFavorite = (carId) => api.post('/cars/favorites/', { car_id: carId });
export const removeFavorite = (favId) => api.delete(`/cars/favorites/${favId}/`);

export default api;
