import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const ApiService = {
  login: (data) => api.post('/login', data),

  // Pour register, on vérifie si c'est un FormData (upload fichier)
  register: (data) => {
    if (data instanceof FormData) {
      // Ne pas forcer Content-Type à 'application/json', axios gère automatiquement multipart/form-data
      return api.post('/register', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    }
    // Sinon envoi classique JSON
    return api.post('/register', data);
  },

  getUserProfile: () => api.get('/user'),
  logout: () => api.post('/logout'),
  updateProfile: (data) => api.put('/profile', data),
};

// Upload d'images (exemple)
ApiService.uploadImage = (file) => {
  const formData = new FormData();
  formData.append('images', file);
  return api.post('/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

ApiService.getImages = () => api.get('/images');

export default ApiService;
