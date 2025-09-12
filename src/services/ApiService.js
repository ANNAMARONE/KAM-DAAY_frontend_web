import axios from 'axios';
// Avant (local)
const API_BASE_URL = 'http://127.0.0.1:8000/api';
export const PROFILE_BASE_URL = 'http://localhost:8000/images/profiles';
export const PRODUCT_BASE_URL = 'http://127.0.0.1:8000/storage';

// Après (production)
// const API_BASE_URL = 'https://maroon-stingray-625742.hostingersite.com/api';
// export const PROFILE_BASE_URL = 'https://maroon-stingray-625742.hostingersite.com/images/profiles';
// export const PRODUCT_BASE_URL = 'https://maroon-stingray-625742.hostingersite.com/storage';

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
  //client plus resentes
  GetClientResente:()=>api.get('/clients/recents'),
//rechercher les clients par nom, prénom ou téléphone
  searchClients: (searchTerm) =>
    api.get('/clients/search', { params: { q: searchTerm } }),


  searchVendeuses: (searchTerm) =>
    api.get('/recherche_utilisateur', { params: { q: searchTerm } }),

   
  //exporter les clients format pdf
  exportClients: (format = 'csv') =>
    api.get('/exportmes_clients', {
      params: { format },
      responseType: 'blob',
    }),
    exportVendeuse: (format = 'csv') =>
      api.get('/export_utilisateurs', {
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
  getClientById(id) {
    return api.get(`/detail_client/${id}`);
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
  deleteClient: (id) => api.delete(`/soft_delete_client/${id}`),

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

  //route pour tableau de bord

  //Afficher le nombre de mes client
  getNombreClients: () => api.get('/nombre-clients'),

  getNombreVentesAujourdhui: () => api.get('/nombre-ventes-aujourdhui'),

  getRevenusDuMois: () => api.get('/revenus-du-mois'),

  getTauxSatisfaction: () => api.get('/taux-satisfaction-positif'),

  getStatistiques: () => api.get('/statistiques'),
  
  getFeedbacks:()=> api.get('/feedbacks-recents'),

//fonctionnalite pour l'administrateur
 //afficher notifications
  getNotifications: () => api.get('/notifications'),

  markNotificationAsRead: (id) => api.post(`/notifications/${id}/read`),


  //afficher les vendeuses
  getVendeuses: () => api.get('/utilisateurs'),
  
  //ajouter une vendeuse
  addVendeuse: (data) => {
    if (data instanceof FormData) {
      return api.post('/ajouter_vendeuse', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
    return api.post('/ajouter_vendeuse', data);
  },
  
  //modifier une vendeuse
  updateVendeuse: (id, data) => {
    if (data instanceof FormData) {
      return api.post(`/admin/modifier_vendeuse/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }
  },

  //supprimer une vendeuse
  deleteVendeuse: (id) => api.delete(`/supprimer_utilisateur/${id}`),

  //afficher les statistiques des ventes par jour
  getStatistiquesVentesParJour: () => api.get('/statistiques-ventes-par-jour'),

  //afficher les statistiques des ventes par mois
  getStatistiquesVentesParMois: () => api.get('/statistiques-ventes-par-mois'),

  getNombreUtilisateurs: () => api.get('/admin/nombre-utilisateurs'),
  getNombreVentes: () => api.get('/admin/nombre-ventes'),
  getNombreVendeuses: () => api.get('/admin/nombre-vendeuses'),
  getNombreProduits: () => api.get('/admin/nombre-produits'),
  getNombreClients: () => api.get('/admin/nombre-clients'),
  getVendeuses: () => api.get('/admin/vendeuses'),
  activeVendeuse: (id) => api.post(`/activer_utilisateur/${id}`),
  desactiveVendeuse: (id) => api.post(`/desactiver_utilisateur/${id}`),
  getDetailVendeuse: (id) => api.get(`/utilisateur_detail/${id}`),
  getClientsAdmin: () => api.get('/clients'),
  getVentes: () =>api.get('/ventes'),
  getProduitsAdmin:()=>api.get('/admin/produits'),

  getprofile:() =>api.get('/user', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    }),
  
    getRecentActions: ()=> api.get("/recent-actions"),
    
  updateProfile(data) {
    return api.post('/user/update-profile', data, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  },
  getVentesParMois() {
    return api.get("/ventes-par-mois");
  }
  
  
};

export default ApiService;
