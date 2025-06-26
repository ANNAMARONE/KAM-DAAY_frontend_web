import React, { useState } from 'react';
import Swal from 'sweetalert2';
import ApiService from '../../services/ApiService';

export default function ForgotPasswordRequestModal({ onClose }) {
  const [telephone, setTelephone] = useState('');
  const [loading, setLoading] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState('');

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
    setWhatsappLink(''); // reset link avant appel

    try {
        const formData = new FormData();
        formData.append('telephone', telephone);
        const response = await ApiService.forgotPassword(formData);

        if (response.data.status === 'success') {
            setWhatsappLink(response.data.whatsapp_link); // pour l'afficher
            Swal.fire({
              icon: 'success',
              title: 'Lien envoyé',
              text: 'Un lien vous a été envoyé sur votre WhatsApp.',
              confirmButtonText: 'Ouvrir WhatsApp',
            }).then((result) => {
              if (result.isConfirmed) {
                window.open(response.data.whatsapp_link, '_blank'); // ouverture manuelle
              }
            });
          }
    } catch (err) {
      console.error('Erreur API forgotPassword:', err);
      console.log('Erreur JSON Axios:', err.toJSON?.());
      console.log('Message:', err.message);

      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err.response?.data?.message || "Échec de l'envoi du lien.",
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
            {loading ? 'Envoi en cours...' : 'Envoyer lien WhatsApp'}
          </button>
        </form>
        {whatsappLink && (
  <p style={{ marginTop: '15px' }}>
    Voir le lien ici : <a href={whatsappLink} target="_blank" rel="noopener noreferrer">{whatsappLink}</a>
  </p>
)}

      </div>
    </div>
  );
}
