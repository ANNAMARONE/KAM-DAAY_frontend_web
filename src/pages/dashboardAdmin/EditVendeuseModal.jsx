import React, { useState, useEffect } from 'react';
import '../../styles/EditVendeuseModal.css';

function EditVendeuseModal({ isOpen, onClose, vendeuse, onUpdate }) {
  const [formData, setFormData] = useState({
    profile: null,
    username: '',
    telephone: '',
    localite: '',
    statut: '',
    domaine_activite: '',
    GIE: '',
  });

  useEffect(() => {
    if (vendeuse) {
      setFormData({
        profile: null,
        username: vendeuse.username || '',
        telephone: vendeuse.telephone || '',
        localite: vendeuse.localite || '',
        statut: vendeuse.statut?.toLowerCase() || 'inactif',
        domaine_activite: vendeuse.domaine_activite || '',
        GIE: vendeuse.GIE || '',
      });
    }
  }, [vendeuse]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile') {
      setFormData((prev) => ({ ...prev, profile: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataToSend = new FormData();
    if (formData.profile) {
      dataToSend.append('profile', formData.profile);
    }
    dataToSend.append('username', formData.username);
    dataToSend.append('telephone', formData.telephone);
    dataToSend.append('localite', formData.localite);
    dataToSend.append('statut', formData.statut);
    dataToSend.append('domaine_activite', formData.domaine_activite);
    dataToSend.append('GIE', formData.GIE);

    onUpdate(dataToSend);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlayVen">
      <div className="modal-contentVen">
        <h2>Modifier Vendeuse</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          
          {vendeuse.profile && (
            <div style={{ marginBottom: '10px' }}>
              <img
                src={`http://localhost:8000/storage/${vendeuse.profile}`}
                alt="Profil actuel"
                style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
              />
            </div>
          )}

          <label>Photo de profil :</label>
          <input type="file" name="profile" accept="image/*" onChange={handleChange} />

          <label>Nom :</label>
          <input type="text" name="username" value={formData.username} onChange={handleChange} required />

          <label>Téléphone :</label>
          <input type="text" name="telephone" value={formData.telephone} onChange={handleChange} required />

          <label>Adresse :</label>
          <input type="text" name="localite" value={formData.localite} onChange={handleChange} required />

          <label>GIE :</label>
          <input type="text" name="GIE" value={formData.GIE} onChange={handleChange} />

          <label>Statut :</label>
          <select name="statut" value={formData.statut} onChange={handleChange} required>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>

          <label>Domaine d'activité :</label>
          <input type="text" name="domaine_activite" value={formData.domaine_activite} onChange={handleChange} />

          <div className="modal-buttons">
            <button type="submit">Enregistrer</button>
            <button type="button" onClick={onClose} className="btn-cancel">Annuler</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditVendeuseModal;
