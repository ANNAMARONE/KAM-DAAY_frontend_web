import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';

// Images et styles
import Logo from '../../assets/images/logo_dark.png';
import '../../styles/login.css';
import '../../styles/theme.css';
import '../../index.css';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique pour la connexion (ex: appel API Laravel)
    console.log(formData);
  };

  return (
    <div className="LoginContaine">
      {/* Partie gauche avec fond + logo + avantages */}
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

      {/* Partie droite avec le formulaire */}
      <div className="LcontainerDroite">
        <h1>Se connecter à mon compte</h1>
        <form onSubmit={handleSubmit}>
          <label>Nom d'utilisateur :</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Se connecter</button>
        </form>

        <p>Vous n’avez pas encore de compte ? <Link to="/register">Créer un compte</Link></p>
      </div>
    </div>
  );
}

