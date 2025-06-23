import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Register from './pages/auth/Register'
import Login from './pages/auth/login'
function App() {
  
  return (
     <Routes>
      <Route path="/" element={<Register/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      {/* Add other routes here as needed */}
     </Routes>
  )
}

export default App
