// src/pages/client/ClientEditModal.jsx
import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';
import Swal from 'sweetalert2';
import '../../styles/modal.css';

export default function ClientEditModal({ clientId, onClose, onRefresh }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await ApiService.getClientById(clientId);
        setClient(response.data);
      } catch (error) {
        console.error('Erreur chargement client', error);
      }
    };

    fetchClient();
  }, [clientId]);

  const handleChange = (e) => {
    setClient({ ...client, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await ApiService.updateClient(clientId, client);
      Swal.fire('Succès', 'Client mis à jour avec succès', 'success');
      onRefresh(); 
      onClose();   
    } catch (error) {
      console.error('Erreur mise à jour', error);
      Swal.fire('Erreur', 'Impossible de modifier le client', 'error');
    }
  };

  if (!client) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <button className="close-modal-btn" onClick={onClose}>&times;</button>
        <h3>Modifier Client</h3>
        <input type="text" name="nom" value={client.nom} onChange={handleChange} placeholder="Nom" />
        <input type="text" name="prenom" value={client.prenom} onChange={handleChange} placeholder="Prénom" />
        <input type="tel" name="telephone" value={client.telephone} onChange={handleChange} placeholder="Téléphone" />
        <input type="text" name="adresse" value={client.adresse} onChange={handleChange} placeholder="Adresse" />
        <select name="type" value={client.type} onChange={handleChange}>
          <option value="particulier">Particulier</option>
          <option value="entreprise">Entreprise</option>
        </select>
<<<<<<< HEAD
        <select name="statut" value={client.statut} onChange={handleChange}>
=======
        <select type="hiden" name="statut" value={client.statut} onChange={handleChange}>
>>>>>>> develop
          <option value="actif">Actif</option>
          <option value="inactif">Inactif</option>
        </select>
        <button onClick={handleUpdate} className="btn-submit">Enregistrer</button>
      </div>
    </div>
  );
}
