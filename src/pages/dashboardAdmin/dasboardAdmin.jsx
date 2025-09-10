import React, { useEffect, useState } from "react";
import { FaChartBar, FaUsers, FaShoppingCart, FaBox } from "react-icons/fa";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import ApiService from "../../services/ApiService";
import "../../styles/theme.css";
import "../../index.css";
import "../../styles/admindasboad.css";

export default function DashboardAdmin() {
  const [stats, setStats] = useState({
    totalUtilisateurs: 0,
    totalVentes: 0,
    totalProduits: 0,
    totalVendeuses: 0,
    totalClients: 0,
  });
  const [salesData, setSalesData] = useState([]);
  const [vendeuses, setVendeuses] = useState([]);

  const fetchSalesData = async () => {
    try {
      const response = await ApiService.getVentesParMois();
      const rawData = Array.isArray(response.data)
        ? response.data
        : response.data.ventes || [];

      if (!Array.isArray(rawData)) {
        console.error("Format de données inattendu:", response.data);
        return;
      }

      const moisOrdre = [
        "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
        "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
      ];

      const sortedData = rawData.sort(
        (a, b) => moisOrdre.indexOf(a.mois) - moisOrdre.indexOf(b.mois)
      );

      setSalesData(sortedData);
    } catch (error) {
      console.error("Erreur lors de la récupération des ventes par mois:", error);
    }
  };

  useEffect(() => {
    fetchAllStats();
    fetchVendeuses();
    fetchSalesData();
  }, []);

  const fetchAllStats = async () => {
    try {
      const [
        utilisateursRes,
        ventesRes,
        produitsRes,
        vendeusesRes,
        clientsRes,
      ] = await Promise.all([
        ApiService.getNombreUtilisateurs(),
        ApiService.getNombreVentes(),
        ApiService.getNombreProduits(),
        ApiService.getNombreVendeuses(),
        ApiService.getNombreClients(),
      ]);

      setStats({
        totalUtilisateurs: utilisateursRes.data.nombre_utilisateurs,
        totalVentes: ventesRes.data.nombre_ventes,
        totalProduits: produitsRes.data.nombre_produits,
        totalVendeuses: vendeusesRes.data.nombre_vendeuses,
        totalClients: clientsRes.data.nombre_client,
      });
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    }
  };

  const fetchVendeuses = async () => {
    try {
      const response = await ApiService.getVendeuses();
      const vendeuseArray = response.data.vendeuses || response.data;
      setVendeuses(vendeuseArray);
    } catch (error) {
      console.error("Erreur lors du fetch des vendeuses:", error);
    }
  };

  const toggleStatut = async (id, index, currentStatut) => {
    try {
      const statutMin = (currentStatut || "").toLowerCase();

      if (statutMin === "actif") {
        await ApiService.desactiveVendeuse(id);
      } else {
        await ApiService.activeVendeuse(id);
      }

      const updated = [...vendeuses];
      updated[index].statut = statutMin === "actif" ? "inactif" : "actif";
      setVendeuses(updated);
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error);
    }
  };

  return (
    <div className="dashboard-admin">
      <div className="stats-grid">
        <div className="stat-card clients-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Clients</p>
              <p className="stat-value">{stats.totalClients}</p>
            </div>
            <FaUsers className="stat-icon" size={32} />
          </div>
        </div>

        <div className="stat-card ventes-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Ventes</p>
              <p className="stat-value">{stats.totalVentes}</p>
            </div>
            <FaShoppingCart className="stat-icon" size={32} />
          </div>
        </div>

        <div className="stat-card produits-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Produits</p>
              <p className="stat-value">{stats.totalProduits}</p>
            </div>
            <FaBox className="stat-icon" size={32} />
          </div>
        </div>

        <div className="stat-card vendeuses-card">
          <div className="stat-content">
            <div>
              <p className="stat-label">Vendeuses</p>
              <p className="stat-value">{stats.totalVendeuses}</p>
            </div>
            <FaChartBar className="stat-icon" size={32} />
          </div>
        </div>
      </div>

      <div className="chart-container">
        <h2 className="section-title">Évolution des ventes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mois" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="total"
              stroke="#8884d8"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="vendeuses-section">
        <h2 className="section-title">Quelques vendeuses</h2>
        <div className="table-responsive">
          <table className="vendeuses-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Téléphone</th>
                <th>Domaine</th>
                <th>Localité</th>
                <th>GIE</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {vendeuses.map((v, index) => {
                const statutStr = v.statut || "";
                const isActif = statutStr.toLowerCase() === "actif";

                return (
                  <tr key={index}>
                    <td>{v.username}</td>
                    <td>{v.telephone}</td>
                    <td>{v.domaine_activite}</td>
                    <td>{v.localite}</td>
                    <td>{v.GIE}</td>
                    <td>
                      <input
                        type="checkbox"
                        checked={isActif}
                        onChange={() => toggleStatut(v.id, index, v.statut)}
                      />
                      <span
                        className={`vendeuse-statut ${
                          isActif ? "statut-actif" : "statut-inactif"
                        }`}
                      >
                        {isActif ? "actif" : "inactif"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
