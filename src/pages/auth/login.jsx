import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import ApiService from '../../services/ApiService';
import ForgotPasswordRequestModal from './ForgotPasswordRequestModal';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
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
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
          <div className="password-wrapper">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          
          />
           <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
            {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
            </div>
          {passwordError && <small className="error">{passwordError}</small>}
                  <div className="remember-forgot-container">
          <div className="remember-section">
            <input
              type="checkbox"
              name="remember"
              id="remember"
              className="remember-checkbox"
            />
            <label htmlFor="remember">Se souvenir de moi</label>
          </div>

                    <button
            type="button"
            className="forgot-password-link"
            onClick={() => setShowForgotModal(true)}
          >
            Mot de passe oublié ?
          </button>
        </div>

          <button className='actionbutton' type="submit">Se connecter</button>
        </form>
        {showForgotModal && (
  <ForgotPasswordRequestModal onClose={() => setShowForgotModal(false)} />
)}
        <p>Vous n’avez pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
      </div>
    </div>
  );
  
}



