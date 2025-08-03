import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/logo_dark.png';
import '../../styles/register.css';
import '../../index.css';
import '../../styles/theme.css';
import ApiService from '../../services/ApiService';
import { IoMdCheckmarkCircleOutline } from 'react-icons/io';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import ForgotPasswordRequestModal from './ForgotPasswordRequestModal';
import PhoneInput from 'react-phone-input-2';
import { FaWhatsapp } from 'react-icons/fa';
import 'react-phone-input-2/lib/style.css';
export default function Register() {
  // const [profile, setProfile] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [telephone, setTelephone] = useState('');
  // const [localite, setLocalite] = useState('');
  const [domaineActivite, setDomaineActivite] = useState('');
  const [GIE, setGIE] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  
  const [validationErrors, setValidationErrors] = useState({});
  const localNumber = telephone.replace(/^221/, ''); 
  const resetForm = () => {
    // setProfile(null);
    setUsername('');
    setPassword('');
    setPasswordConfirmation('');
    setTelephone('');
    // setLocalite('');
    setDomaineActivite('');
    setGIE('');
    setValidationErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setValidationErrors({});

    const errors = {};

    // if (!profile) {
    //   errors.profile = "La photo de profil est requise.";
    // } else if (!['image/jpeg', 'image/png', 'image/jpg'].includes(profile.type)) {
    //   errors.profile = "La photo de profil doit être au format JPG ou PNG.";
    // } else if (profile.size > 2 * 1024 * 1024) {
    //   errors.profile = "La taille de l'image ne doit pas dépasser 2 Mo.";
    // }

    if (!username) {
      errors.username = "Le nom d'utilisateur est requis.";
    } else if (username.length < 5) {
      errors.username = "Le nom d'utilisateur doit contenir au moins 5 caractères.";
    } else if (username.length > 20) {
      errors.username = "Le nom d'utilisateur ne doit pas dépasser 20 caractères.";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = "Le nom d'utilisateur ne doit contenir que des lettres, chiffres ou underscores.";
    }
    if (!password) {
      errors.password = "Le mot de passe est requis.";
    } else if (password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères.";
    // } else if (!/[A-Z]/.test(password)) {
    //   errors.password = "Le mot de passe doit contenir au moins une majuscule.";
    // } else if (!/[a-z]/.test(password)) {
    //   errors.password = "Le mot de passe doit contenir au moins une minuscule.";
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Le mot de passe doit contenir au moins un chiffre.";
    }

    if (!passwordConfirmation) {
      errors.password_confirmation = "La confirmation du mot de passe est requise.";
    } else if (password !== passwordConfirmation) {
      errors.password_confirmation = "Les mots de passe ne correspondent pas.";
    }

    if (!localNumber) {
      errors.telephone = "Le numéro de téléphone est requis.";
    } else if (!/^\d{9}$/.test(localNumber)) {
      errors.telephone = "Le téléphone doit contenir exactement 9 chiffres.";
    }else if (!/^(7[05678]\d{7})$/.test(localNumber)) {
      errors.telephone = "Numéro sénégalais invalide.";
    }

    // if (!localite) {
    //   errors.localite = "La localité est requise.";
    // } else if (localite.length < 3) {
    //   errors.localite = "La localité doit contenir au moins 3 caractères.";
    // } else if (!/^[a-zA-Z\s\-']+$/.test(localite)) {
    //   errors.localite = "La localité ne doit contenir que des lettres.";
    // }

    if (!domaineActivite) {
      errors.domaine_activite = "Le domaine d'activité est requis.";
    }

    if (GIE && GIE.length < 3) {
      errors.GIE = "Le nom du GIE doit contenir au moins 3 caractères.";
    } else if (GIE && !/^[a-zA-Z0-9\s\-']+$/.test(GIE)) {
      errors.GIE = "Le GIE ne doit contenir que des lettres, chiffres, tirets ou apostrophes.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      setIsSubmitting(false);
      return;
    }

    // Construction de FormData pour envoyer fichier + données
    const formData = new FormData();
    // formData.append('profile', profile);
    formData.append('username', username);
    formData.append('password', password);
    formData.append('password_confirmation', passwordConfirmation);
    formData.append('telephone', telephone);
    // formData.append('localite', localite);
    formData.append('domaine_activite', domaineActivite);
    if (GIE) {
      formData.append('GIE', GIE);
    }

    try {
      await ApiService.register(formData); // Envoi des données à l'API
      resetForm();
      navigate('/login');
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        setValidationErrors(error.response.data.errors);
      } else {
        setValidationErrors({general: "Une erreur est survenue, veuillez réessayer."});
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files.length > 0) {
      setProfile(files[0]);
    } else {
      switch (name) {
        case 'username': setUsername(value); break;
        case 'password': setPassword(value); break;
        case 'password_confirmation': setPasswordConfirmation(value); break;
        case 'telephone': setTelephone(value); break;
        case 'localite': setLocalite(value); break;
        case 'domaine_activite': setDomaineActivite(value); break;
        case 'GIE': setGIE(value); break;
        default: break;
      }
    }
  };

  return (
    <div className="RegisterContaine">
      <div className='RcontaineGauche'>
        <img src={Logo} alt="Logo" className='logo' />
        <h1>Plateforme de <br /> gestion relation client</h1>
        <div className="avantages">
          <ul>
            <li><span><IoMdCheckmarkCircleOutline /></span>Suivez vos clients</li>
            <li><span><IoMdCheckmarkCircleOutline /></span>Gardez une trace de vos ventes</li>
            <li><span><IoMdCheckmarkCircleOutline /></span>Prenez de meilleures décisions</li>
          </ul>
        </div>
      </div>

      <div className="RcontainerDroite">
        <h1>Rejoignez KAM-DAAY !<br />Créer mon compte</h1>

        <form onSubmit={handleSubmit} encType="multipart/form-data">

          {/* <label>Photo de profil :</label>
          <input type="file" name="profile" accept="image/*" onChange={handleChange} />
          {validationErrors.profile && <small className="error">{validationErrors.profile}</small>} */}

          <label>Nom d'utilisateur :</label>
          <input type="text" name="username" value={username} onChange={handleChange} />
          {validationErrors.username && <small className="error">{validationErrors.username}</small>}

          <label>Mot de passe :</label>
<div className="password-wrapper">
  <input
    type={showPassword ? 'text' : 'password'}
    name="password"
    value={password}
    onChange={handleChange}
  />
  <button type="button" onClick={() => setShowPassword(!showPassword)} className="toggle-password">
  {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
  </button>
</div>
{validationErrors.password && <small className="error">{validationErrors.password}</small>}

        <label>Confirmation du mot de passe :</label>
        <div className="password-wrapper">
          <input
            type={showPasswordConfirmation ? 'text' : 'password'}
            name="password_confirmation"
            value={passwordConfirmation}
            onChange={handleChange}
          />
          <button type="button" onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)} className="toggle-password">
          {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
          </button>
        </div>
          {validationErrors.password_confirmation && <small className="error">{validationErrors.password_confirmation}</small>}
          <div className="form-group">
      <label htmlFor="telephone" className="flex items-center gap-2 font-medium text-gray-700">
        <FaWhatsapp color="green" size={18} /> Numéro WhatsApp
      </label>

      <PhoneInput
        country={'sn'} // 🇸🇳 Sénégal par défaut
        value={telephone}
        onChange={setTelephone}
        inputProps={{
          name: 'telephone',
          required: true,
          autoFocus: true,
        }}
        enableSearch={true}
        placeholder="Entrez votre numéro"
        containerClass="custom-phone-container"
        inputClass="custom-phone-input"
        buttonClass="custom-flag-button"
      />

      {validationErrors.telephone && (
        <small className="text-red-600">{validationErrors.telephone}</small>
      )}
    </div>
 
          {/* <label>Localité :</label>
          <input type="text" name="localite" value={localite} onChange={handleChange} />
          {validationErrors.localite && <small className="error">{validationErrors.localite}</small>} */}

          <label>Domaine d'activité :</label>
          <select name="domaine_activite" value={domaineActivite} onChange={handleChange}>
            <option value="">Choisir un domaine</option>
            <option value="halieutique">Halieutique</option>
            <option value="Agroalimentaire">Agroalimentaire</option>
            <option value="Artisanat local">Artisanat local</option>
            <option value="Savons / Cosmétiques">Savons / Cosmétiques</option>
            <option value="Jus locaux">Jus locaux</option>
          </select>
          {validationErrors.domaine_activite && <small className="error">{validationErrors.domaine_activite}</small>}

          <label>GIE :</label>
          <input type="text" name="GIE" value={GIE} onChange={handleChange} />
          {validationErrors.GIE && <small className="error">{validationErrors.GIE}</small>}

          <button type="submit" className='actionbutton' disabled={isSubmitting}>S'inscrire</button>
          {validationErrors.general && <small className="error">{validationErrors.general}</small>}
        </form>

        <p>Vous avez déjà un compte ? <Link to="/login">Se connecter</Link></p>
      </div>
    </div>
  );
}
