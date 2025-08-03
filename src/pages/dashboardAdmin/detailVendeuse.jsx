import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import { MdOutlineArrowBackIos } from 'react-icons/md';
import '../../styles/detailVendeuse.css';

function DetailVendeuse() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendeuse, setVendeuse] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vendeuseSelected, setVendeuseSelected] = useState(null);
  useEffect(() => {
    fetchVendeuse();
  }, []);

  const fetchVendeuse = async () => {
    try {
      const response = await ApiService.getDetailVendeuse(id);
      setVendeuse(response.data.data);
    } catch (error) {
      console.error('Erreur lors de la récupération de la vendeuse :', error);
    }
  };
  if (!vendeuse) return <p className="loading">Chargement...</p>;

  return (
    <div className="detail-vendeuse">
      <button onClick={() => navigate(-1)} className="btn-back1">
        <MdOutlineArrowBackIos /> Retour
      </button>

      <h2 className="vendeuse-title">Profil de la vendeuse : {vendeuse.username}</h2>

      <div className="info-section">
        <p><strong>Téléphone :</strong> {vendeuse.telephone}</p>
        <p><strong>Adresse :</strong> {vendeuse.localite}</p>
        <p><strong>GIE :</strong> {vendeuse.GIE}</p>
        <p><strong>Statut :</strong> {vendeuse.statut}</p>
        <p><strong>Domaine d'activité :</strong> {vendeuse.domaine_activite}</p>
      </div>

      <h3>Produits</h3>
      <div className="produits-grid">
        {vendeuse.produits.map(p => (
          <div key={p.id} className="produit-card">
            <img src={`http://localhost:8000/storage/${p.image}`} alt={p.nom} />
            <p><strong>{p.nom}</strong></p>
            <p>{p.prix_unitaire} FCFA</p>
            <p>{p.stock} {p.unite}</p>
          </div>
        ))}
      </div>

      <h3>Ventes</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>ID Vente</th>
            <th>Date</th>
            <th>Produits vendus</th>
          </tr>
        </thead>
        <tbody>
          {vendeuse.ventes.map(v => (
            <tr key={v.id}>
              <td>{v.id}</td>
              <td>{new Date(v.created_at).toLocaleDateString()}</td>
              <td>
                <ul>
                  {v.produits.map(prod => (
                    <li key={prod.id}>
                      {prod.nom} - {prod.pivot.quantite} x {prod.pivot.prix_unitaire} FCFA = {prod.pivot.montant_total} FCFA
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Clients</h3>
      <table className="styled-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Adresse</th>
          </tr>
        </thead>
        <tbody>
          {vendeuse.clients.map(client => (
            <tr key={client.id}>
              <td>{client.prenom} {client.nom}</td>
              <td>{client.telephone}</td>
              <td>{client.adresse}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DetailVendeuse;
