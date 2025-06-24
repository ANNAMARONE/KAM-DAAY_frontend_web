import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import ApiService from '../../services/ApiService';

// Images et styles
import Logo from '../../assets/images/logo_dark.png';
import '../../styles/login.css';
import '../../styles/theme.css';
import '../../index.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateForm = () => {
    let isValid = true;
    setUsernameError('');
    setPasswordError('');

    if (username.trim() === '') {
      setUsernameError("Le nom d'utilisateur est requis.");
      isValid = false;
    } else if (username.length < 5 || username.length > 20) {
      setUsernameError("Le nom d'utilisateur doit contenir entre 5 et 20 caractères.");
      isValid = false;
    } 

    if (password.trim() === '') {
      setPasswordError("Le mot de passe est requis.");
      isValid = false;
    } else if (password.length < 4) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await ApiService.login({ username, password });

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      
        // verifier le rôle de l'utilisateur
        if (response.data.user.role === 'admin') {
          window.location.href = '/Admin dasboard';
        }else if (response.data.user.role === 'vendeuse') {
          window.location.href = '/dasboard';
        }

      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Nom d'utilisateur ou mot de passe incorrect.");
      } else {
        console.error("Erreur lors de la connexion:", error);
        alert("Une erreur est survenue. Veuillez réessayer plus tard.");
      }
    }
  };

  return (
    <div className="LoginContaine">
      {/* Partie gauche */}
      <div className="LcontaineGauche">
        <img src={Logo} alt="Logo" className="logo" />
        <h1>Plateforme de <br /> gestion relation client</h1>
        <div className="avantages">
          <ul>
            <li><span><IoMdCheckmarkCircleOutline /></span>Suivez vos clients</li>
            <li><span><IoMdCheckmarkCircleOutline /></span>Gardez une trace de vos ventes</li>
            <li><span><IoMdCheckmarkCircleOutline /></span>Prenez de meilleures décisions</li>
          </ul>
        </div>
      </div>

      {/* Partie droite */}
      <div className="LcontainerDroite">
        <h1>Se connecter à mon compte</h1>
        <form onSubmit={handleSubmit}>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            
          />
          {usernameError && <small className="error">{usernameError}</small>}

          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          
          />
          {passwordError && <small className="error">{passwordError}</small>}

          <button type="submit">Se connecter</button>
        </form>

        <p>Vous n’avez pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
      </div>
    </div>
  );
}
