import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { MdInventory } from 'react-icons/md';

import {
  AiOutlineHome, AiOutlineUser, AiOutlineLogout, AiOutlineShopping,
  AiOutlineBarChart, AiOutlineSetting, AiOutlineSearch, AiOutlineBell,
  AiOutlineUserAdd, AiOutlineTeam, AiOutlineQuestionCircle
} from 'react-icons/ai'
import { HiHandRaised } from 'react-icons/hi2'; 
import { FaSearch, FaBell } from 'react-icons/fa'
import Logo from '../../assets/images/logo_light.png'
import '../../styles/_layouts.css'
import '../../styles/theme.css'
import '../../index.css'
import ApiService from '../../services/ApiService'
import { PROFILE_BASE_URL } from '../../services/ApiService';

function LayoutVendeuse({ onSearch }) {
  const navigate = useNavigate()
  const [openClientMenu, setOpenClientMenu] = useState(false)
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const handleLogout = () => {
    ApiService.logout()
      .then(() => {
        localStorage.removeItem('token');
        navigate('/login');
      })
      .catch((error) => {
        console.error('Erreur lors de la déconnexion:', error);
      });
  };
 // Vérification de l'authentification
useEffect(() => {
  const token = localStorage.getItem('token')
  if (!token) {
    navigate('/login')
  }
}, [])
useEffect(() => {
  if (onSearch) {
    onSearch(searchTerm);
  }
}, [searchTerm]);
  //afficher l'utilisateur connecté
  useEffect(() => {
    ApiService.getCurrentUser()
      .then((response) => {
        setUser(response.data.user); 
      })
      .catch((error) => {
        console.error('Erreur récupération utilisateur :', error);
      });
  }, []);
  
  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <img src={Logo} alt="Logo" className='logo' />
        </div>
        <div className="header-center">
          
          {user ? (
              <>
                <h1 className="welcome-message">  Bonjour, {user.username} <HiHandRaised className="salut-icon" />
                  <br />
                Bienvenu</h1>
              </>
            ) : (
              <p className="no-user">Aucun utilisateur</p>
            )}
          
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text"
             placeholder="Rechercher..."
              className="search-input" 
              value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)} />
            <button className="search-button" onClick={() => onSearch && onSearch(searchTerm)}>
        <FaSearch />
      </button>
          </div>
          <div className="user-profile">
  {user ? (
    <NavLink to="/profile">
      <img
        src={`${PROFILE_BASE_URL}/${user.profile}`}
        alt="Profil"
        className="profile"
      />
    </NavLink>
  ) : (
    <p className="no-user">Aucun utilisateur</p>
  )}
</div>



          <div className="notification-icon">
            <FaBell className="bell" />
          </div>
        </div>
      </header>

      <div className="admin-body">
        {/* SIDEBAR */}
        <aside className="admin-sidebar">
          <nav className="sidebar-nav">
            <ul>
                        

              <li>
                <NavLink to="/dasboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineHome /> <span>Tableau de bord</span>
                </NavLink>
              </li>

              <li>
              <NavLink 
                to="/Afficher_client"
                className={({ isActive }) => `nav-link special-link ${isActive ? 'active' : ''}`}
              >
                <AiOutlineUserAdd className="icon-special" />
                <span>Mes clients</span>
              </NavLink>
            </li>
              {/* gestion des ventes */}
              <li>
                <NavLink to="/ventes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineShopping /> <span>Ajouter une vente</span>
                </NavLink>
              </li>
             {/* Gestion de mes ventes */}
           
              <li>
                <NavLink
                 to="/afficher/ventes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                 >
                  <AiOutlineBell /> <span>Afficher mes ventes</span>
                </NavLink>
              </li>

            


              {/* Gestion Client */}
              <li>
                <NavLink to="/gestion/client" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineSetting /> <span>Gestion des Clients</span>
                </NavLink>
             
              </li>

                <li>
                  <NavLink to="/gestion/produit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                    <MdInventory /> <span>Gestion des produits</span>
                  </NavLink>
                </li>
              {/* <li>
                <NavLink to="/admin/statistiques" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineBarChart /> <span>Statistiques</span>
                </NavLink>
              </li> */}
              <li>
                <NavLink to="/admin/parametres" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineSetting /> <span>Paramètres</span>
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout} className="nav-link logout-btn">
                  <AiOutlineLogout /> <span>Déconnexion</span>
                </button>
              </li>
            </ul>

            {/* Bouton Aide en bas */}
            <div className="sidebar-bottom">
              <NavLink to="/admin/aide" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <AiOutlineQuestionCircle /> <span>Aide</span>
              </NavLink>
            </div>
          </nav>
        </aside>

        {/* CONTENU PRINCIPAL */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default LayoutVendeuse