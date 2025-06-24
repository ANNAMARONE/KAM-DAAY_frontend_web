import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ApiService from '../../services/ApiService' // ajustez le chemin selon votre structure
import '../../styles/form.css'

export default function AjouterClient() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    telephone: '',
    adresse: '',
    statut: '',
    type: '',
    date_vente: '',
    produits: [
      { nom: '', quantite: 1, prix_unitaire: 0 }
    ]
  })

  const handleChange = (e, index = null, field = null) => {
    if (index !== null && field !== null) {
      const updatedProduits = [...formData.produits]
      updatedProduits[index][field] = e.target.value
      setFormData({ ...formData, produits: updatedProduits })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const addProduit = () => {
    setFormData({
      ...formData,
      produits: [...formData.produits, { nom: '', quantite: 1, prix_unitaire: 0 }]
    })
  }

  const removeProduit = (index) => {
    const updated = [...formData.produits]
    updated.splice(index, 1)
    setFormData({ ...formData, produits: updated })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await ApiService.post('/clients', formData)
      alert('Client ajouté avec succès !')
      navigate('/admin/clients/liste')
    } catch (error) {
      console.error(error)
      alert("Erreur lors de l'enregistrement")
    }
  }

  return (
    <div className="form-container">
      <h2>Ajouter un Client</h2>
      <form onSubmit={handleSubmit}>
        <input name="prenom" placeholder="Prénom" onChange={handleChange} required />
        <input name="nom" placeholder="Nom" onChange={handleChange} required />
        <input name="telephone" placeholder="Téléphone" onChange={handleChange} required />
        <input name="adresse" placeholder="Adresse" onChange={handleChange} />
        <input name="statut" placeholder="Statut" onChange={handleChange} required />
        <input name="type" placeholder="Type de client" onChange={handleChange} required />
        <input type="date" name="date_vente" onChange={handleChange} required />

        <h4>Produits</h4>
        {formData.produits.map((produit, index) => (
          <div key={index} className="produit-group">
            <input
              placeholder="Nom du produit"
              value={produit.nom}
              onChange={(e) => handleChange(e, index, 'nom')}
              required
            />
            <input
              type="number"
              placeholder="Quantité"
              value={produit.quantite}
              onChange={(e) => handleChange(e, index, 'quantite')}
              required
            />
            <input
              type="number"
              placeholder="Prix unitaire"
              value={produit.prix_unitaire}
              onChange={(e) => handleChange(e, index, 'prix_unitaire')}
              required
            />
            {formData.produits.length > 1 && (
              <button type="button" onClick={() => removeProduit(index)}>Supprimer</button>
            )}
          </div>
        ))}
        <button type="button" onClick={addProduit}>+ Ajouter un produit</button>

        <button type="submit">Enregistrer</button>
      </form>
    </div>
  )
}
