import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL + '/api',
  withCredentials: true, // Important for cookies
});

// Request interceptor (Optional: if we need to attach tokens from localStorage as fallback)
api.interceptors.request.use(
  (config) => {
    // If not using cookies, get token from local storage
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized (e.g., redirect to login, clear state)
      // window.location.href = '/login';
    }
    return Promise.reject(error.response?.data || error);
  }
);

export default api;
