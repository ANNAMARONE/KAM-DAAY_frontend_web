import React, { useEffect, useState } from 'react';
import ApiService, { PRODUCT_BASE_URL } from '../../services/ApiService';
import '../../styles/gestionProduit.css';
import '../../styles/theme.css';
import Swal from 'sweetalert2';

function GestionProduits() {
  const [produits, setProduits] = useState([]);
  const [formData, setFormData] = useState({
    nom: '',
    prix_unitaire: '',
    stock: '',
    unite: 'kg',
    image: null
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = () => {
    ApiService.getProduits()
      .then(res => setProduits(res.data.produits))
      .catch(err => console.error(err));
  };

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) data.append(key, value);
    });

    try {
      if (editId) {
        await ApiService.updateProduit(editId, data);
      } else {
        await ApiService.addProduit(data);
      }
      fetchProduits();
      setFormData({ nom: '', prix_unitaire: '', stock: '', unite: 'kg', image: null });
      setEditId(null);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = produit => {
    setEditId(produit.id);
    setFormData({
      nom: produit.nom,
      prix_unitaire: produit.prix_unitaire,
      stock: produit.stock,
      unite: produit.unite,
      image: null
    });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Ce produit sera définitivement supprimé.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });
  
    if (result.isConfirmed) {
      try {
        await ApiService.supprimerProduit(id);
        fetchProduits();
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Le produit a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        });
      } catch (error) {
        console.error('Erreur suppression produit', error);
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La suppression du produit a échoué.',
        });
      }
    }
  };

  const handleStockUpdate = async (e, id) => {
    e.preventDefault();
    const stock = e.target.elements.stock.value;
    await ApiService.updateStock(id, { stock: stock });
    fetchProduits();
  };

  return (
    <div className="produits-container">
      <h2>Mes Produits</h2>

      <form onSubmit={handleSubmit} className="form-produit">
        <input name="nom" value={formData.nom} onChange={handleChange} placeholder="Nom" required />
        <input name="prix_unitaire" type="number" value={formData.prix_unitaire} onChange={handleChange} placeholder="Prix unitaire" required />
        <input name="stock" type="number" value={formData.stock} onChange={handleChange} placeholder="Stock" required />
        <select name="unite" value={formData.unite} onChange={handleChange}>
          <option value="kg">Kg</option>
          <option value="litre">Litre</option>
          <option value="unite">Unité</option>
        </select>
        <input type="file" name="image" onChange={handleChange} />
        <button type="submit">{editId ? 'Modifier' : 'Ajouter'}</button>
      </form>

      <table className="table-produits">
        <thead>
          <tr>
            <th>Image</th>
            <th>Nom</th>
            <th>Prix Unitaire</th>
            <th>Stock</th>
            <th>Unité</th>
            <th>Actions</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {produits.map(produit => (
            <tr key={produit.id}>
              <td>
                {produit.image && (
                  <img src={`${PRODUCT_BASE_URL}/${produit.image}`} alt={produit.nom} width="50" height="50" />
                )}
              </td>
              <td>{produit.nom}</td>
              <td>{parseFloat(produit.prix_unitaire).toLocaleString()} FCFA</td>
              <td>{produit.stock}</td>
              <td>{produit.unite}</td>
              <td>
                <button className="btn-edit" onClick={() => handleEdit(produit)}>Modifier</button>
                <button  onClick={() => handleDelete(produit.id)} className="btn-delete">Supprimer</button>
              </td>
              <td>
                <form onSubmit={e => handleStockUpdate(e, produit.id)}>
                  <input  className="btn-stock" type="number" name="stock" placeholder="Nouveau stock" min="0" />
                  <button type="submit">OK</button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestionProduits;
