import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  AiOutlineHome, AiOutlineUser, AiOutlineLogout, AiOutlineShopping,
  AiOutlineBarChart, AiOutlineSetting, AiOutlineSearch, AiOutlineBell,
  AiOutlineUserAdd, AiOutlineTeam, AiOutlineQuestionCircle
} from 'react-icons/ai'
import { HiHandRaised } from 'react-icons/hi2'; 
import { FaSearch, FaUser, FaBell } from 'react-icons/fa'
import Logo from '../../assets/images/logo_light.png'
import '../../styles/_layouts.css'
import '../../styles/theme.css'
import '../../index.css'
import ApiService from '../../services/ApiService'
import { PROFILE_BASE_URL } from '../../services/ApiService';
function LayoutVendeuse() {
  const navigate = useNavigate()
  const [openClientMenu, setOpenClientMenu] = useState(false)
  const [user, setUser] = useState(null);
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
            <input type="text" placeholder="Rechercher..." className="search-input" />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="user-profile">
  {user ? (
    <>
      
      <img
        src={`${PROFILE_BASE_URL}/${user.profile}`}
        alt="Profil"
        className="profile"
      />
     
    </>
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
                <span>Ajouter un client</span>
              </NavLink>
            </li>
              {/* gestion des ventes */}
              <li>
                <NavLink to="ventes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineShopping /> <span>Ajouter un ventes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/feedback" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineBell /> <span>Feedback</span>
                </NavLink>
              </li>

              {/* Gestion Client */}
              <li>
                <div className="nav-link submenu-toggle" onClick={() => setOpenClientMenu(!openClientMenu)}>
                  <AiOutlineSetting /> <span>Gestion Client</span>
                </div>
                {openClientMenu && (
                  <ul className="submenu">
                    <li>
                      <NavLink to="/admin/clients/ajouter" className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}>
                        <AiOutlineUserAdd /> <span>Ajouter client</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/clients/liste" className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}>
                        <AiOutlineTeam /> <span>Voir les clients</span>
                      </NavLink>
                    </li>
                    <li>
                      <NavLink to="/admin/clients/rechercher" className={({ isActive }) => `nav-sublink ${isActive ? 'active' : ''}`}>
                        <AiOutlineSearch /> <span>Rechercher</span>
                      </NavLink>
                    </li>
                  </ul>
                )}
              </li>

              <li>
                <NavLink to="/admin/Vente" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineShopping /> <span>Gestion des ventes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/admin/statistiques" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineBarChart /> <span>Statistiques</span>
                </NavLink>
              </li>
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