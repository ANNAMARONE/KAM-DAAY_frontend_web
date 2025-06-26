import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/login'
import DasboardAdmin from './pages/dashboardAdmin/dasboardAdmin'
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
      <Route path="/ventes" element={<Ventes/>} />
      </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<PrivateRoute allowedRoles={['admin']} />}>
      <Route element={<WithSidebarAdmin />}>
      <Route path="/admin dasboard" element={<DasboardAdmin />} />
      <Route path="/Ajouter_client" element={<AjouterClient />} />
      </Route>
      </Route>
      {/* Add other routes here as needed */}
     </Routes>
  )
}

export default App
