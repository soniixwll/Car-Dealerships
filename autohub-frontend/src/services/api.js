import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'ngrok-skip-browser-warning': 'true' },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
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
