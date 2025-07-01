import React, { useEffect, useState } from 'react';
import { 
  FaUsers, FaShoppingCart, FaMoneyBillWave, FaSmile, FaChartLine, 
  FaUserPlus, FaEye, FaFrown 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import '../../styles/theme.css';
import '../../index.css';
import '../../styles/vendeuseDasboard.css';
import ApiService from '../../services/ApiService';

import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, 
  Title, Tooltip, Legend, Filler 
} from 'chart.js';

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler
);

function DasboardVendeuse() {
  const [clients, setClients] = useState([]);
  const [nombreClients, setNombreClients] = useState(0);
  const [ventesAujourdhui, setVentesAujourdhui] = useState(0);
  const [revenusDuMois, setRevenusDuMois] = useState(0);
  const [tauxSatisfaction, setTauxSatisfaction] = useState(0);
  const [ventesParMois, setVentesParMois] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [clientsRecent,setClientsRecent]=useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les clients
        const clientsResponse = await ApiService.getClients();
        setClients(clientsResponse.data);

        //charger les client plus recente
        const clientRecent=await ApiService.GetClientResente();
        setClientsRecent(clientRecent.data)
        // Charger les statistiques globales
        const statsRes = await ApiService.getStatistiques();
        setNombreClients(statsRes.data.nombre_clients);
        setVentesAujourdhui(statsRes.data.ventes_aujourdhui);
        setRevenusDuMois(statsRes.data.revenus_du_mois);
        setTauxSatisfaction(statsRes.data.taux_satisfaction);
        setVentesParMois(statsRes.data.ventes_par_mois);

        // Charger feedbacks récents
        const feedbacksRes = await ApiService.getFeedbacks();
        setFeedbacks(feedbacksRes.data);

      } catch (err) {
        console.error('Erreur lors du chargement des données du tableau de bord', err);
      }
    };

    fetchData();
  }, []);

  // Préparer labels et données pour les 6 derniers mois
  const moisLabels = [];
  const moisNombres = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    moisLabels.push(date.toLocaleString('fr-FR', { month: 'short' }));
    const key = (date.getMonth() + 1).toString();
    moisNombres.push(Number(ventesParMois[key]) || 0);
  }

  const data = {
    labels: moisLabels,
    datasets: [
      {
        label: 'Ventes (FCFA)',
        data: moisNombres,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Tendances des ventes sur 6 mois' },
    },
  };

  return (
    <div className='AContainerDashboard'>
      <h2 className="dashboard-title">Tableau de bord</h2>

      {/* Cartes résumées */}
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <FaUsers className="card-icon" />
          <div>
            <h3>Clients</h3>
            <p>{nombreClients} enregistrés</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaShoppingCart className="card-icon" />
          <div>
            <h3>Ventes</h3>
            <p>{ventesAujourdhui} aujourd'hui</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaMoneyBillWave className="card-icon" />
          <div>
            <h3>Revenus</h3>
            <p>{Number(revenusDuMois).toLocaleString()} FCFA ce mois</p>
          </div>
        </div>

        <div className="dashboard-card">
          <FaSmile className="card-icon" />
          <div>
            <h3>Satisfaction</h3>
            <p>{tauxSatisfaction}% positifs</p>
          </div>
        </div>

        <div className="dashboard-card chart-card">
          <div style={{ maxWidth:'80%', width: '100%' }}>
            <Line data={data} options={options} />
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
  {feedbacks.length === 0 && <li>Aucun feedback récent</li>}
  {feedbacks.slice(0, 3).map(fb => {
    const client = fb?.vente?.client;
    return (
      <li key={fb.id}>
        {fb.satisfait ? (
          <FaSmile className="feedback-icon positive" />
        ) : (
          <FaFrown className="feedback-icon negative" />
        )}
        <span>
          {client ? `${client.nom} ${client.prenom}` : 'Client inconnu'} :{' '}
          {fb.commentaire || (fb.satisfait ? 'Très satisfait' : 'Insatisfait')}
        </span>
      </li>
    );
  })}
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
              {clientsRecent.slice(0, 3).map(client => (
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

export default DasboardVendeuse;
