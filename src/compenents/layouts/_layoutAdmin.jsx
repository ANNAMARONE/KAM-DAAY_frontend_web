import React, { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  AiOutlineHome, AiOutlineUser, AiOutlineLogout, AiOutlineShopping,
  AiOutlineBarChart, AiOutlineSetting, AiOutlineSearch, AiOutlineBell,
  AiOutlineUserAdd, AiOutlineTeam, AiOutlineQuestionCircle
} from 'react-icons/ai'
import { FaSearch, FaUser, FaBell } from 'react-icons/fa'
import Logo from '../../assets/images/logo_light.png'
import '../../styles/_layouts.css'
import '../../styles/theme.css'
import '../../index.css'

export default function LayoutAdmin() {
  const navigate = useNavigate()
  const [openClientMenu, setOpenClientMenu] = useState(false)

  const handleLogout = () => {
    console.log('Déconnexion')
    navigate('/login')
  }

  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <img src={Logo} alt="Logo" className='logo' />
        </div>
        <div className="header-center">
          <h1 className="welcome-message">Bienvenue, Admin</h1>
        </div>
        <div className="header-right">
          <div className="search-container">
            <input type="text" placeholder="Rechercher..." className="search-input" />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="profile-icon">
            <NavLink to="/admin/profil" className="nav-link">
              <FaUser className="user-icon" /> <p>Anna Marone</p>
            </NavLink>
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
              <NavLink 
                to="/Ajouter_client"
                className={({ isActive }) => `nav-link special-link ${isActive ? 'active' : ''}`}
              >
                <AiOutlineUserAdd className="icon-special" />
                <span>Ajouter un client</span>
              </NavLink>
            </li>

              <li>
                <NavLink to="/admin dasboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                  <AiOutlineHome /> <span>Tableau de bord</span>
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
