import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/login'

import DasboardVendeuse from './pages/dasboardVendeuse/dasboardVendeuse'
import PrivateRoute from './routes/PrivateRoute' 
import LayoutVendeuse from './compenents/layouts/_layoutVendeuse'
import LayoutAdmin from './compenents/layouts/_layoutAdmin'
import AjouterClient from './pages/dasboardVendeuse/AjouterClient'
import ForgotPasswordRequestModal from './pages/auth/ForgotPasswordRequestModal'
import ResetPassword from './pages/auth/ResetPassword'
import AfficherClient from './pages/dasboardVendeuse/AfficherClient'
import ClientDetailModal from './pages/dasboardVendeuse/ClientDetailModal'
import Ventes from './pages/dasboardVendeuse/ventes'
import AjouterProduit from './pages/dasboardVendeuse/ajouterProduit'
import AfficherVente from './pages/dasboardVendeuse/AfficherVente'
import GestionProduits from './pages/dasboardVendeuse/gestionProduit'
import GestionClient from './pages/dasboardVendeuse/GestionClient'
import ClientSupprimer from './pages/dasboardVendeuse/ClientSupprimer'
import DashboardAdmin from './pages/dashboardAdmin/dasboardAdmin'
import GestionClient_admin from './pages/dashboardAdmin/GestionClient_admin'
import GestionVendeuse_admin from './pages/dashboardAdmin/GestionVendeuse_admin'
import Gestionproduit_admin from './pages/dashboardAdmin/Gestionproduit_admin'
import GestionVentes_admin from './pages/dashboardAdmin/GestionVentes_admin'
import ParamettreAdmin from './pages/dashboardAdmin/ParamettreAdmin'
import DetailVendeuse from './pages/dashboardAdmin/detailVendeuse'
import ProfileVendeuse from './pages/dasboardVendeuse/ProfileVendeuse'
import 'react-phone-input-2/lib/style.css';

// Composant WithSidebar
const WithSidebarVendeuse = () => (
  <LayoutVendeuse/>
);

// Composant WithSidebar
const WithSidebarAdmin = () => (
  <LayoutAdmin/>
     
);


function App() {
  
  return (
     <Routes>
      <Route path="/" element={<Register/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPasswordRequestModal/>} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Vendeuse Routes */}
      <Route element={<PrivateRoute allowedRoles={['vendeuse']} />}>
      <Route element={<WithSidebarVendeuse />}>
      <Route path="/dasboard" element={<DasboardVendeuse/>} />
      <Route path="/Ajouter client" element={<AjouterClient />} />
      <Route path="/Afficher_client" element={<AfficherClient />} />
      <Route path="/clients/:id" element={<ClientDetailModal/>} />
      <Route path="/ajouter_produit" element={<AjouterProduit />} />
      <Route path="/ventes" element={<Ventes/>} />
      <Route path="/afficher/ventes" element={<AfficherVente/>} />
      <Route path="/gestion/produit" element={<GestionProduits/>}/>
      <Route path="/gestion/client" element={<GestionClient/>}/>
      <Route path="/client/supprimer/:id" element={<ClientSupprimer />} />
      <Route path="/client/modifier/:id" element={<AjouterClient />} />
      <Route path="/client/supprimer" element={<ClientSupprimer />} />
     <Route path="/profile" element={<ProfileVendeuse />} />

      </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
      <Route element={<WithSidebarAdmin />}>
      <Route path="/admin dasboard" element={<DashboardAdmin />} />
      <Route path="/Ajouter_client" element={<AjouterClient />} />
      <Route path="/gestion_client" element={<GestionClient_admin />} />
      <Route path="/gestion_vendeuse" element={<GestionVendeuse_admin/>} />
      <Route path="/gestion_produit" element={<Gestionproduit_admin />} />
      <Route path="/gestion_ventes" element={<GestionVentes_admin/>} />
      <Route path="/parametre" element={<ParamettreAdmin/>} />
      <Route path="/vendeuses/:id" element={<DetailVendeuse />} />
      <Route path="/admin/profile" element={<ProfileVendeuse />} />
      </Route>
      </Route>
      {/* Add other routes here as needed */}
     </Routes>
  )
}

export default App
