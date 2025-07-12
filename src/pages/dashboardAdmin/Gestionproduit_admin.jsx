import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';
import '../../styles/gestionProduitAdmin.css';
import { PRODUCT_BASE_URL } from '../../services/ApiService';

function Gestionproduit_admin() {
  const [produits, setProduits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const produitsParPage = 6;

  useEffect(() => {
    fetchProduits();
  }, []);

  const fetchProduits = async () => {
    try {
      const response = await ApiService.getProduitsAdmin(); 
      setProduits(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des produits :', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logique
  const indexDernierProduit = currentPage * produitsParPage;
  const indexPremierProduit = indexDernierProduit - produitsParPage;
  const produitsActuels = produits.slice(indexPremierProduit, indexDernierProduit);
  const totalPages = Math.ceil(produits.length / produitsParPage);

  const changerPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) return <p>Chargement des produits...</p>;

  return (
    <div className="gestion-produit-container">
      <h2>Liste des Produits</h2>
      {produits.length === 0 ? (
        <p>Aucun produit trouvé.</p>
      ) : (
        <>
          <table className="produit-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Nom</th>
                <th>Prix Unitaire</th>
                <th>Stock</th>
                <th>Unité</th>
                <th>Vendeuse</th>
              </tr>
            </thead>
            <tbody>
              {produitsActuels.map((produit) => (
                <tr key={produit.id}>
                  <td>
                    <img
                      src={`${PRODUCT_BASE_URL}/${produit.image}`}
                      alt={produit.nom}
                      width="80"
                      height="80"
                    />
                  </td>
                  <td>{produit.nom}</td>
                  <td>{produit.prix_unitaire} FCFA</td>
                  <td>{produit.stock}</td>
                  <td>{produit.unite}</td>
                  <td>{produit.user ? produit.user.username : 'Non défini'}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => changerPage(currentPage - 1)} disabled={currentPage === 1}>
              Précédent
            </button>
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                onClick={() => changerPage(index + 1)}
                className={currentPage === index + 1 ? 'active' : ''}
              >
                {index + 1}
              </button>
            ))}
            <button onClick={() => changerPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Gestionproduit_admin;
