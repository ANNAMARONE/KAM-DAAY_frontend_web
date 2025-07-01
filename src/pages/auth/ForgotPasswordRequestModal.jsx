import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ApiService from '../../services/ApiService';
import { useNavigate } from 'react-router-dom';

export default function ForgotPasswordRequestModal({ onClose }) {
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (telephone.trim().length < 8) {
      Swal.fire({
        icon: 'warning',
        title: 'Numéro invalide',
        text: 'Veuillez entrer un numéro de téléphone valide.',
      });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('telephone', telephone);

      const response = await ApiService.forgotPassword(formData);

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Un lien de réinitialisation a été généré.',
      });

      // Redirection vers la page de réinitialisation avec token et téléphone
      const { token, telephone: tel } = response.data;
      navigate(`/reset-password?token=${token}&telephone=${tel}`);
    } catch (err) {
      console.error('Erreur API forgotPassword:', err);

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer plus tard.",
      });
    }

    setLoading(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Mot de passe oublié</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Numéro de téléphone"
            value={telephone}
            onChange={(e) => setTelephone(e.target.value)}
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Envoi en cours..." : "Envoyer"}
          </button>
        </form>
      </div>
    </div>
  );
}
