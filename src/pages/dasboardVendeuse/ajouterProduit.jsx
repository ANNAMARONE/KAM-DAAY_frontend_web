import React, { useState } from 'react'
import axios from 'axios'
import '../../styles/ajouterProduit.css'
import ApiService from '../../services/ApiService'
import '../../styles/theme.css';
import Swal from 'sweetalert2';

function AjouterProduits({ onClose }) {
  const [formData, setFormData] = useState({
    nom: '',
    image: null,
    prix_unitaire: '',
    stock: '',
    unite: 'kg',
  })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = new FormData()
    for (let key in formData) {
      data.append(key, formData[key])
    }

    try {
      const response = await ApiService.addProduit(data)

      setSuccess(true)
      setErrors({})
      setFormData({
        nom: '',
        image: null,
        prix_unitaire: '',
        stock: '',
        unite: 'kg',
      })
      onClose() 
      console.log('Produit ajouté avec succès:', response.data)
      Swal.fire({
  icon: 'success',
  title: 'Succès',
  text: 'Produit ajouté avec succès !',
  timer: 2000,
  showConfirmButton: false
});

    } catch (error) {
      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors)
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de l’ajout du produit.',
        });
      }
    }
  }

  return (
    <div className="ajouter-produit-container">
      <h2>Ajouter un Produit</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nom</label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
          />
          {errors.nom && <p className="error">{errors.nom[0]}</p>}
        </div>

        <div>
          <label>Image</label>
          <input type="file" name="image" onChange={handleChange} />
          {errors.image && <p className="error">{errors.image[0]}</p>}
        </div>

        <div>
          <label>Prix unitaire</label>
          <input
            type="number"
            name="prix_unitaire"
            value={formData.prix_unitaire}
            onChange={handleChange}
          />
          {errors.prix_unitaire && (
            <p className="error">{errors.prix_unitaire[0]}</p>
          )}
        </div>

        <div>
          <label>Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
          />
          {errors.stock && <p className="error">{errors.stock[0]}</p>}
        </div>

        <div>
          <label>Unité</label>
          <select
            name="unite"
            value={formData.unite}
            onChange={handleChange}
          >
            <option value="kg">kg</option>
            <option value="litre">litre</option>
            <option value="unite">unité</option>
          </select>
          {errors.unite && <p className="error">{errors.unite[0]}</p>}
        </div>

        <div className="modal-actions">
          <button type="submit" className="submit-btn">
            Enregistrer
          </button>
    
         <button className="cancel-btn1" type="button"  onClick={onClose}>
            Annuler
          </button>
         
        </div>
      </form>

      {success && <p className="success-msg">Produit ajouté avec succès !</p>}
    </div>
  )
}

export default AjouterProduits
