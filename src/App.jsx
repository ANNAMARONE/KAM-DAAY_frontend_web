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
     

      {/* Vendeuse Routes */}
      <Route element={<PrivateRoute allowedRoles={['vendeuse']} />}>
      <Route element={<WithSidebarVendeuse />}>
      <Route path="/dasboard" element={<DasboardVendeuse/>} />
      <Route path="/Ajouter client" element={<AjouterClient />} />
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
