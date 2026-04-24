import axios from 'axios';

const api = axios.create({ baseURL: 'http://127.0.0.1:8000/api' });

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export const getCars = (params) => api.get('/cars/', { params });
export const getCar = (id) => api.get(`/cars/${id}/`);
export const getBrands = () => api.get('/cars/brands/');
export const getDealerships = () => api.get('/dealerships/');
export const getDealership = (id) => api.get(`/dealerships/${id}/`);
export const calculateCost = (id, params) => api.get(`/cars/${id}/calculate/`, { params });
export const login = (data) => api.post('/auth/login/', data);
export const register = (data) => api.post('/auth/register/', data);
export const getProfile = () => api.get('/auth/profile/');
export const updateProfile = (data) => api.patch('/auth/profile/', data);
export const getBookings = () => api.get('/bookings/');
export const createBooking = (data) => api.post('/bookings/', data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}/`);
export const getFavorites = () => api.get('/cars/favorites/');
export const addFavorite = (carId) => api.post('/cars/favorites/', { car_id: carId });
export const removeFavorite = (favId) => api.delete(`/cars/favorites/${favId}/`);

export default api;
