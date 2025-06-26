import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import '../../styles/form.css';

export default function AjouterClient() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    type: '',
    date_vente: '',
    produits: [{ nom: '', quantite: 1, prix_unitaire: 0, image: null }],
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProduitChange = (index, field, eventOrValue) => {
    const newProduits = [...formData.produits];
    if (field === 'image') {
      newProduits[index][field] = eventOrValue.target.files[0];
    } else {
      newProduits[index][field] = eventOrValue;
    }
    setFormData({ ...formData, produits: newProduits });
  };

  const addProduit = () => {
    setFormData({
      ...formData,
      produits: [...formData.produits, { nom: '', quantite: 1, prix_unitaire: 0, image: null }],
    });
  };

  const removeProduit = (index) => {
    const updatedProduits = [...formData.produits];
    updatedProduits.splice(index, 1);
    setFormData({ ...formData, produits: updatedProduits });
  };

  const validateForm = () => {
    const newErrors = {};
    const phoneRegex = /^[0-9\s+().-]{6,20}$/;

    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est requis.';
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis.';
    if (!formData.telephone.trim()) {
      newErrors.telephone = 'Le téléphone est requis.';
    } else if (!phoneRegex.test(formData.telephone)) {
      newErrors.telephone = 'Format du téléphone invalide.';
    }
    if (!formData.type.trim()) newErrors.type = 'Le type est requis.';
    if (!formData.date_vente) newErrors.date_vente = 'La date est requise.';
    if (!formData.adresse.trim()) newErrors.adresse = 'L’adresse est requise.';

    formData.produits.forEach((produit, index) => {
      if (!produit.nom.trim()) newErrors[`produit_nom_${index}`] = 'Nom du produit requis.';
      if (!produit.quantite || produit.quantite < 1) newErrors[`produit_qte_${index}`] = 'Quantité invalide.';
      if (produit.prix_unitaire < 0) newErrors[`produit_prix_${index}`] = 'Prix invalide.';
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
  
    if (!validateForm()) {
      setLoading(false);
      return;
    }
  
    try {
      const data = new FormData();
      data.append('prenom', formData.prenom);
      data.append('nom', formData.nom);
      data.append('telephone', formData.telephone);
      data.append('adresse', formData.adresse);
      data.append('type', formData.type);
      data.append('date_vente', formData.date_vente);
  
      formData.produits.forEach((produit, index) => {
        data.append(`produits[${index}][nom]`, produit.nom);
        data.append(`produits[${index}][quantite]`, produit.quantite);
        data.append(`produits[${index}][prix_unitaire]`, produit.prix_unitaire);
        if (produit.image) {
          data.append(`produits[${index}][image]`, produit.image);
        }
      });
  
      const response = await ApiService.addClient(data);
      console.log(response.data);
      setMessage('✅ Client et vente enregistrés avec succès !');
      navigate('/Afficher_client');
    } catch (error) {
      console.error(error);
      setMessage("❌ Erreur lors de l’enregistrement.");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="form-container">
      <h2>Ajouter un Client</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit}>
        <div className="FlexFroms">
          <div>
            <input name="prenom" placeholder="Prénom" value={formData.prenom} onChange={handleChange} />
            {errors.prenom && <p className="error">{errors.prenom}</p>}

            <input name="nom" placeholder="Nom" value={formData.nom} onChange={handleChange} />
            {errors.nom && <p className="error">{errors.nom}</p>}

            <input name="telephone" placeholder="Téléphone" value={formData.telephone} onChange={handleChange} />
            {errors.telephone && <p className="error">{errors.telephone}</p>}

            <input name="adresse" placeholder="Adresse" value={formData.adresse} onChange={handleChange} />
            {errors.adresse && <p className="error">{errors.adresse}</p>}

            <input name="type" placeholder="Type" value={formData.type} onChange={handleChange} />
            {errors.type && <p className="error">{errors.type}</p>}

            <input type="date" name="date_vente" value={formData.date_vente} onChange={handleChange} />
            {errors.date_vente && <p className="error">{errors.date_vente}</p>}
          </div>

          <div>
            <h4>Produits</h4>
            {formData.produits.map((produit, index) => (
              <div key={index} className="produit-group">
                <div className="name-group">
                  <div>
                    <label>Nom du produit</label>
                    <input
                      name="nom"
                      placeholder="Nom produit"
                      value={produit.nom}
                      onChange={(e) => handleProduitChange(index, 'nom', e.target.value)}
                    />
                    {errors[`produit_nom_${index}`] && <p className="error">{errors[`produit_nom_${index}`]}</p>}
                  </div>
                  <div>
                    <label>Quantité</label>
                    <input
                      name="quantite"
                      type="number"
                      value={produit.quantite}
                      onChange={(e) => handleProduitChange(index, 'quantite', e.target.value)}
                    />
                    {errors[`produit_qte_${index}`] && <p className="error">{errors[`produit_qte_${index}`]}</p>}
                  </div>
                </div>

                <div className="name-group">
                  <div>
                    <label>Prix unitaire</label>
                    <input
                      name="prix_unitaire"
                      type="number"
                      value={produit.prix_unitaire}
                      onChange={(e) => handleProduitChange(index, 'prix_unitaire', e.target.value)}
                    />
                    {errors[`produit_prix_${index}`] && <p className="error">{errors[`produit_prix_${index}`]}</p>}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleProduitChange(index, 'image', e)}
                  />
                </div>

                <button type="button" onClick={() => removeProduit(index)} className="btn-remove">🗑</button>
              </div>
            ))}

            <div className="buttonClient">
              <button className="ajoutProduit" type="button" onClick={addProduit}>+ Ajouter un produit</button>
              <button className="submitClient" type="submit" disabled={loading}>
                {loading ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
// AjouterClient.jsx