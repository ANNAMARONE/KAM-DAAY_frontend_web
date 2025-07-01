import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import ApiService from '../../services/ApiService';
import '../../styles/resetPassword.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get('token');
  const telephone = searchParams.get('telephone');

  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !telephone) {
      Swal.fire({
        icon: 'error',
        title: 'Lien invalide',
        text: 'Token ou numéro manquant.',
      }).then(() => {
        navigate('/login');
      });
    }
  }, [token, telephone, navigate]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      Swal.fire({
        icon: 'warning',
        title: 'Erreur',
        text: 'Les mots de passe ne correspondent pas.',
      });
      return;
    }

    setLoading(true);

    if (password.length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Mot de passe trop court',
        text: 'Le mot de passe doit contenir au moins 8 caractères.',
      });
      return;
    }
    

    try {
      const response = await ApiService.resetPassword({
        token,
        telephone,
        password,
        password_confirmation: passwordConfirmation,
      });

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: response.data.message || 'Mot de passe modifié.',
      }).then(() => {
        navigate('/login');
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.error || 'Une erreur est survenue.',
      });
    }

    setLoading(false);
  };

  return (
    <div className="reset-container">
      <h2>Réinitialiser le mot de passe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Nouveau mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Confirmer le mot de passe"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Envoi...' : 'Réinitialiser'}
        </button>
      </form>
    </div>
  );
}
