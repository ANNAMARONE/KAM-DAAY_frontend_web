import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  AiOutlineHome, AiOutlineUser, AiOutlineLogout, AiOutlineShopping,
  AiOutlineBarChart, AiOutlineSetting, AiOutlineUserAdd,
  AiOutlineQuestionCircle
} from 'react-icons/ai';
import { HiHandRaised } from 'react-icons/hi2';
import { FaSearch, FaBell } from 'react-icons/fa';
import { MdInventory } from 'react-icons/md';
import { AiOutlineTeam } from 'react-icons/ai';

import Logo from '../../assets/images/logo_light.png';
import '../../styles/_layouts.css';
import '../../styles/theme.css';
import '../../index.css';
import ApiService, { PROFILE_BASE_URL } from '../../services/ApiService';

export default function LayoutAdmin({ onSearch }) {
  const navigate = useNavigate();
  const [openClientMenu, setOpenClientMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) navigate('/login');
  }, []);

  useEffect(() => {
    if (onSearch) onSearch(searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    ApiService.getCurrentUser()
      .then((response) => setUser(response.data.user))
      .catch((error) => console.error('Erreur récupération utilisateur :', error));
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await ApiService.getNotifications();
      const notifs = response.data;
      const unread = notifs.filter(n => n.read_at === null).length;
      setNotifications(notifs);
      setUnreadCount(unread);
    } catch (error) {
      console.error('Erreur notifications:', error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await ApiService.markNotificationAsRead(id);
      fetchNotifications();
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
    }
  };
  // Gestion du scroll si menu ouvert
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
  }, [menuOpen])
  return (
    <div className="admin-container">
      {/* HEADER */}
      <header className="admin-header">
        <div className="header-left">
          <img src={Logo} alt="Logo" className="logo" />
        </div>
        <div className="header-center">
          {user ? (
            <h1 className="welcome-message">
              Bonjour, {user.username} <HiHandRaised className="salut-icon" />
              <br />
              Bienvenu
            </h1>
          ) : (
            <p className="no-user">Aucun utilisateur</p>
          )}
        </div>
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Rechercher..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">
              <FaSearch />
            </button>
          </div>
          <div className="user-profile">
            {user ? (
              <NavLink to="/admin/profile">
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

          <div className="notification-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
            <FaBell className="bell" />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
            {dropdownOpen && (
              <div className="notification-dropdown">
                {notifications.length === 0 ? (
                  <p className="empty-message">Aucune notification</p>
                ) : (
                  notifications.map((notif) => (
                    <div key={notif.id} className={`notif-item ${notif.read_at ? '' : 'unread'}`}>
                      <p>{notif.data.message || 'Nouvelle notification'}</p>
                      {!notif.read_at && (
                        <button onClick={() => markAsRead(notif.id)} className="btn-lire">
                          Marquer comme lu
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
         {/* Toggle menu mobile */}
         <div className="mobile-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          <span className="bar"></span>
          <span className="bar"></span>
          <span className="bar"></span>
        </div>
      </header>

      <div className="admin-body">
        {/* SIDEBAR */}
        <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
          <nav className="sidebar-nav">
            <ul>
              <li>
                <NavLink to="/admin dasboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}>
                  <AiOutlineHome /> <span>Tableau de bord</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/gestion_vendeuse" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                onClick={() => setMenuOpen(false)}>
                  <AiOutlineUser /> <span>Suivi des vendeuses</span>
                </NavLink>
              </li>
              <li>
                <NavLink to='/gestion_client' className="nav-link submenu-toggle" onClick={() => setMenuOpen(false)}>
                <AiOutlineTeam /> <span>Gestion Client</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/gestion_ventes" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  <AiOutlineShopping /> <span>Gestion des ventes</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/gestion_produit" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  <MdInventory /> <span>Gestion des produits</span>
                </NavLink>
              </li>

             
              <li>
                <NavLink to="/admin/statistiques" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  <AiOutlineBarChart /> <span>Statistiques</span>
                </NavLink>
              </li>
              <li>
                <NavLink to="/parametre" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
                  <AiOutlineSetting /> <span>Paramètres</span>
                </NavLink>
              </li>
              <li>
                <button onClick={handleLogout}  className="nav-link logout-btn" >
                  <AiOutlineLogout /> <span>Déconnexion</span>
                </button>
              </li>
            </ul>

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
  );
}
