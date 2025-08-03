import React, { useEffect, useState } from 'react';
import ApiService, { PRODUCT_BASE_URL } from '../../services/ApiService';
import '../../styles/gestionVentes.css';

function GestionVentes_admin() {
  const [ventes, setVentes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ventesParPage = 4;

  useEffect(() => {
    fetchVentes();
  }, []);

  const fetchVentes = async () => {
    try {
      const response = await ApiService.getVentes();
      setVentes(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des ventes :', error);
    } finally {
      setLoading(false);
    }
  };

  const indexOfLastVente = currentPage * ventesParPage;
  const indexOfFirstVente = indexOfLastVente - ventesParPage;
  const ventesActuelles = ventes.slice(indexOfFirstVente, indexOfLastVente);

  const totalPages = Math.ceil(ventes.length / ventesParPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) return <p>Chargement des ventes...</p>;

  return (
    <div className="gestion-ventes-container">
      <h2>Liste des Ventes</h2>
      {ventes.length === 0 ? (
        <p>Aucune vente trouvée.</p>
      ) : (
        <>
          <table className="vente-table">
            <thead>
              <tr>
                <th>ID Vente</th>
                <th>Date</th>
                <th>Produits</th>
                <th>Montant Total</th>
              </tr>
            </thead>
            <tbody>
              {ventesActuelles.map((vente) => (
                <tr key={vente.id}>
                  <td>{vente.id}</td>
                  <td>{new Date(vente.created_at).toLocaleDateString()}</td>
                  <td>
                    <ul>
                      {vente.produits.map((p) => (
                        <li key={p.id}>
                          <img
                            src={`${PRODUCT_BASE_URL}/${p.image}`}
                            alt={p.nom}
                            width="80"
                            height="80"
                          />
                          <br />
                          {p.nom} - {p.pivot.quantite} x {p.pivot.prix_unitaire} FCFA = {p.pivot.montant_total} FCFA
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    {vente.produits.reduce(
                      (total, p) => total + parseFloat(p.pivot.montant_total),
                      0
                    ).toFixed(2)} FCFA
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default GestionVentes_admin;
