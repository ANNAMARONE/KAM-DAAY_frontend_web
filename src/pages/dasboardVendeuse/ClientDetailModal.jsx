import React, { useEffect, useState } from 'react';
import '../../styles/client-details.css';
import ApiService from '../../services/ApiService';

export default function ClientDetailModal({ clientId, onClose }) {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const response = await ApiService.getClientDetail(clientId);
        setClient(response.data);
      } catch (error) {
        console.error('Erreur récupération client:', error);
      }
    };

    if (clientId) fetchClient();
  }, [clientId]);

  if (!client) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="client-header">Détails du client</h2>
        <h1 className='clientName'>{client.nom} {client.prenom}</h1>
        <table className="client-info-table">
        
  <thead>
          <tr>
            <th>Téléphone</th>
            <th>Type</th>
            <th>Adresse</th>
            <th>Statut</th>
            <th>Date d'inscription</th>
            <th>Actions</th>
          </tr>
  </thead>
  <tbody>
          <tr>
            <td data-label="Téléphone">{client.telephone}</td>
            <td data-label="Type">{client.type}</td>
            <td data-label="Adresse">{client.adresse}</td>
            <td data-label="Statut">
              <span className={`status-badge ${client.statut.toLowerCase()}`}>
                <span className="status-dot"></span>
                {client.statut}
              </span>
            </td>
            <td data-label="Date d'inscription">
              {new Date(client.created_at).toLocaleDateString('fr-FR')}
            </td>
            <td data-label="Actions">
              <button className="btn-close" onClick={onClose}>Fermer</button>
            </td>
          </tr>
  </tbody>
         </table>


        <h3 className="client-header">Ventes</h3>
        {client.ventes?.length === 0 ? (
          <p>Aucune vente.</p>
        ) : (
          client.ventes.map((vente) => (
            <div key={vente.id} className="vente-block">
              <p><strong>Date :</strong> {new Date(vente.created_at).toLocaleDateString()}</p>
              <table className="vente-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Montant total</th>
                  </tr>
                </thead>
                <tbody>
                  {vente.produits.map((produit) => (
                    <tr key={produit.id}>
                      <td data-label="Produit">{produit.nom}</td>
                      <td data-label="Quantité">{produit.pivot.quantite}</td>
                      <td data-label="Prix unitaire">{produit.pivot.prix_unitaire} F</td>
                      <td data-label="Montant total">{produit.pivot.montant_total} F</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
