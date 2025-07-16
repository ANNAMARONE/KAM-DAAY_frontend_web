import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService'; 
import '../../styles/gestionClient.css';

function GestionClient_admin() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 8;

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await ApiService. getClientsAdmin();
      setClients(response.data.data); 
    } catch (error) {
      console.error('Erreur lors de la récupération des clients :', error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logique
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = clients.slice(indexOfFirstClient, indexOfLastClient);

  const totalPages = Math.ceil(clients.length / clientsPerPage);

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  if (loading) return <p>Chargement des clients...</p>;

  return (
    <div className="gestion-client-container">
      <h2>Liste des Clients</h2>

      {clients.length === 0 ? (
        <p>Aucun client trouvé.</p>
      ) : (
        <>
          <table className="client-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Adresse</th>
                <th>Statut</th>
                <th>Type</th>
                <th>Vendeuse associée</th>
                <th>Ventes</th>
              </tr>
            </thead>
            <tbody>
              {currentClients.map(client => (
                <tr key={client.id}>
                  <td>{client.prenom} {client.nom}</td>
                  <td>{client.telephone}</td>
                  <td>{client.adresse}</td>
                  <td>{client.statut}</td>
                  <td>{client.type}</td>
                  <td>{client.user ? client.user.username : 'Non défini'}</td>
                  <td>
                    {client.ventes && client.ventes.length > 0 ? (
                      <ul>
                        {client.ventes.map(vente => (
                          <li key={vente.id}>
                            Vente #{vente.id} - {new Date(vente.created_at).toLocaleDateString()}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      'Aucune'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="pagination">
            <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>
              Précédent
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={currentPage === i + 1 ? 'active' : ''}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>
              Suivant
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GestionClient_admin;
