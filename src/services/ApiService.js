import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const PROFILE_BASE_URL = 'http://localhost:8000/images/profiles';
export const PRODUCT_BASE_URL = 'http://127.0.0.1:8000/storage';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: 'application/json',
  },
});

// Ajout automatique du token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Gérer les erreurs globalement (ex: 401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

const ApiService = {
  login: (data) => api.post('/login', data),

  register: (data) => {
    if (data instanceof FormData) {
      return api.post('/register', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/register', data);
  },

  forgotPassword: (data) =>
    api.post('/mot-de-passe/oublie-par-telephone', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  logout: () => api.post('/logout'),

  getCurrentUser: () => api.get('/user'),

  resetPassword: ({ token, telephone, password, password_confirmation }) =>
    api.post('/reset-password', {
      token,
      telephone,
      password,
      password_confirmation,
    }),

  updateProfile: (data) => api.put('/profile', data),
//afficher les clients de l'utilisateur connecté
  getClients: () => api.get('/mes_clients'),
 //filter les clients par date
 filterClientsByDate: (startDate, endDate) =>
  api.get(`/clients/filter-by-date`, {
    params: {
      start_date: startDate,
      end_date: endDate,
    },
  }),
//rechercher les clients par nom, prénom ou téléphone
  searchClients: (searchTerm) =>
    api.get('/clients/search', { params: { q: searchTerm } }),
  //exporter les clients format pdf
  exportClients: (format = 'csv') =>
    api.get('/exportmes_clients', {
      params: { format },
      responseType: 'blob',
    }),
    //detail client
  getClientDetail: (id) => api.get(`/detail_client/${id}`),
  //ajouter un client
 
 
  addClient: (data) => {
    return api.post('/ajouter_clients', data, {
      headers: { 'Content-Type': 'application/json' }
    });
  },
  
  //modifier un client
  updateClient: (id, data) => {
    if (data instanceof FormData) {
      return api.put(`/modifier_client/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.put(`/modifier_client/${id}`, data);
  },
  //supprimer un client
  deleteClient: (id) => api.delete(`/supprimer_client/${id}`),

//afficher les produits de l'utilisateur connecté

  getProduits: () => api.get('/produits'),
  //ajouter un produit  
  addProduit: (data) => {
    if (data instanceof FormData) {
      return api.post('/ajouter/produits', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/ajouter_produit', data);
  },
  
  updateProduit: (id, data) =>
    api.post(`/produits/${id}?_method=PUT`, data),
  
  supprimerProduit: (id) =>
    api.delete(`/produits/${id}`),
  
  updateStock: (id, data) =>
    api.post(`/produits/${id}/stock`, data),
  //enregitrer un vente
  addVente: (data) => {
    return api.post('/ajouter_vente', data, {
      headers: { 'Content-Type': 'application/json' },
    });
  },
//lancer une conversation 
startWhatsAppConversation: (venteId) =>
  api.get(`/vente/${venteId}/whatsapp`, {
    headers: { 'Content-Type': 'application/json' },
  }),
  startWhatsAppConversationClient: (clientId) =>
    api.get(`/clients/${clientId}/whatsapp`),
//afficher l'historique de mes ventes
  getMesVentes: () => api.get('/mes_ventes'),
//afficher les ventes par date
  filterVentesByDate: (startDate, endDate) =>
    api.get('/ventes/filter-by-date', {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    }),
//noter une vente satisfait ou non satisfaite
noterVente: (venteId, satisfait) => {
  return api.post(`/ventes/${venteId}/noter/${satisfait}`);
},
//supprimer une vente
supprimerVente: (id) => api.delete(`/ventes/${id}`),


  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('images', file);
    return api.post('/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
 
  getImages: () => api.get('/images'),
};

export default ApiService;
