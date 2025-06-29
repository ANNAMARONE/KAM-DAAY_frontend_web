
import React, { useEffect, useState } from 'react';
import { FaUsers, FaShoppingCart, FaMoneyBillWave, FaSmile, FaChartLine, FaUserPlus, FaEye, FaFrown } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import '../../styles/theme.css'
import '../../index.css'
import '../../styles/vendeuseDasboard.css'
import ApiService from '../../services/ApiService'
function DasboardVendeuse() {
  const [clients, setClients] = useState([]);
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.getClients();
        setClients(response.data);
        setFilteredClients(response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des clients', err);
      }
    };
    fetchClients();
  }, []);

  const navigate = useNavigate()
  return (
    <div className='AContainerDashboard'>
      <h2 className="dashboard-title">Tableau de bord</h2>

      {/* Cartes résumées */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <FaUsers className="card-icon" />
          <div>
            <h3>Clients</h3>
            <p>120 enregistrés</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaShoppingCart className="card-icon" />
          <div>
            <h3>Ventes</h3>
            <p>35 aujourd'hui</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaMoneyBillWave className="card-icon" />
          <div>
            <h3>Revenus</h3>
            <p>125.000 FCFA ce mois</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaSmile className="card-icon" />
          <div>
            <h3>Satisfaction</h3>
            <p>92% positifs</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaChartLine className="card-icon" />
          <div>
            <h3>Statistiques</h3>
            <p>Voir les tendances</p>
          </div>
        </div>
      </div>

      {/* Feedback + clients récents en 2 colonnes */}
      <div className="dashboard-row">
        {/* Nouveaux Feedbacks */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>🗣 Nouveaux Feedbacks</h3>
            <button className="view-more-btn" onClick={() => navigate('/admin/feedback')}>
              <FaEye /> Voir plus
            </button>
          </div>
          <ul className="feedback-list">
            <li>
              <FaSmile className="feedback-icon positive" />
              <span>Client A : Très satisfait</span>
            </li>
            <li>
              <FaFrown className="feedback-icon negative" />
              <span>Client B : Produit endommagé</span>
            </li>
            <li>
              <FaSmile className="feedback-icon positive" />
              <span>Client C : Livraison rapide</span>
            </li>
          </ul>
        </section>

        {/* Table Clients Récents */}
        <section className="dashboard-section">
          <div className="section-header">
            <h3>👥 Derniers Clients</h3>
            <button className="view-more-btn" onClick={() => navigate('/Afficher_client')}>
              <FaEye /> Voir plus
            </button>
          </div>
          <table className="client-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
  {clients.slice(0, 3).map(client => (
    <tr key={client.id}>
      <td>{client.nom} {client.prenom}</td>
      <td>{client.telephone}</td>
      <td>{client.type}</td>
    </tr>
  ))}
</tbody>

          </table>
        </section>
      </div>

      {/* Ajouter un client */}
      <div className="add-client-section">
        <button className="add-client-btn" onClick={() => navigate('/admin/clients/ajouter')}>
          <FaUserPlus /> Ajouter un nouveau client
        </button>
      </div>
    </div>
  )
}

export default DasboardVendeuse