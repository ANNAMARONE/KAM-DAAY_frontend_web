import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import '../../styles/afficherClient.css';
import { MdOutlineArrowBackIos, MdOutlineFilterList } from "react-icons/md";
import { FaSearch, FaPrint } from 'react-icons/fa';
import { AiOutlineClose } from "react-icons/ai";
import { IoLogoWhatsapp, IoMdPersonAdd } from "react-icons/io";
import { TfiExport } from "react-icons/tfi";
import ClientDetailModal from './ClientDetailModal';
import { GrView } from "react-icons/gr";
import '../../styles/theme.css';

function AfficherClient() {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [showExportOptions, setShowExportOptions] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const clientsPerPage = 7;

  const navigate = useNavigate();

  // Sécurisation pour éviter les erreurs .slice
  const safeFilteredClients = Array.isArray(filteredClients) ? filteredClients : [];
  const totalPages = Math.ceil(safeFilteredClients.length / clientsPerPage);
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = safeFilteredClients.slice(indexOfFirstClient, indexOfLastClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.getClients();
        const data = Array.isArray(response.data) ? response.data : [];
        setClients(data);
        setFilteredClients(data);
        console.log("Données reçues de l'API :", response.data);

      } catch (err) {
        console.error('Erreur lors du chargement des clients:', err);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    if (filterStatut) {
      filtered = filtered.filter(client => client.statut === filterStatut);
    }

    if (startDate) {
      filtered = filtered.filter(client => new Date(client.created_at) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(client => new Date(client.created_at) <= new Date(endDate));
    }

    setFilteredClients(filtered);
  }, [clients, filterStatut, startDate, endDate]);

  const handleToggleFilter = () => setShowFilter(!showFilter);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
      return;
    }

    try {
      const response = await ApiService.searchClients(searchTerm);
      const data = Array.isArray(response.data) ? response.data : [];
      setFilteredClients(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de clients:', error);
      setFilteredClients([]);
    }
  };

  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const timer = setTimeout(() => {
        handleSearch();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  const handleExport = async (format) => {
    try {
      const response = await ApiService.exportClients(format);
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = format === 'pdf' ? 'mes_clients.pdf' : 'mes_clients.csv';
      link.click();
    } catch (error) {
      console.error('Erreur export:', error);
    }
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = 'Liste_des_clients';
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

  const handleWhatsappClick = (clientId) => {
    ApiService.startWhatsAppConversationClient(clientId)
      .then(res => {
        if (res.data?.whatsapp_link) {
          window.open(res.data.whatsapp_link, '_blank');
        }
      })
      .catch(err => {
        console.error("Erreur WhatsApp:", err);
      });
  };

  return (
    <div className="client-table-container">
      <div className='headerclientListe'>
        <div className='headerTopLeft'>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <MdOutlineArrowBackIos />
          </button>
          <h1>Liste des Clients</h1>
        </div>

        <div className="search-table">
          <input
            className='search-input-client'
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <button className="search-button_client" onClick={handleSearch}>
            <FaSearch />
          </button>
          <button className="close-button_client" onClick={() => {
            setSearchTerm('');
            setFilteredClients(clients);
          }}>
            <AiOutlineClose />
          </button>
        </div>
      </div>

      <div className="header-tools">
        <div className="filter-container">
          <div className='buttonFilter'>
            <div>
              <label htmlFor="filterStatut">Filtrer par statut :</label><br />
              <select id="filterStatut" value={filterStatut} onChange={e => setFilterStatut(e.target.value)}>
                <option value="">Tous</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>

            <div className='filterDate'>
              <label htmlFor="filterDate">Filtrer par date</label>
              <button onClick={handleToggleFilter}>
                <MdOutlineFilterList size={20} />
                Filtrer par date
              </button>
            </div>
          </div>

          {showFilter && (
            <div style={{ marginTop: 10 }}>
              <label htmlFor="startDate">Date de début :</label>
              <input
                type="date"
                id="startDate"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
              />
              <label htmlFor="endDate" style={{ marginLeft: 10 }}>Date de fin :</label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <button className="btn-filter" onClick={() => setShowFilter(false)}>
                Appliquer
              </button>
            </div>
          )}
        </div>

        <div className='button_Action'>
          <button className="btn-add-client" onClick={() => navigate('/ventes')}>
            <IoMdPersonAdd /> Ajouter un Client
          </button>

          <div className="export-dropdown">
            <button className="btn-export" onClick={() => setShowExportOptions(!showExportOptions)}>
              <TfiExport /> Exporter
            </button>
            {showExportOptions && (
              <div className="export-options">
                <button onClick={() => handleExport('pdf')}>📄 PDF</button>
                <button onClick={() => handleExport('csv')}>🖼️ CSV</button>
              </div>
            )}
          </div>

          <button className="btn-print" onClick={handlePrint}>
            <FaPrint /> Imprimer
          </button>
        </div>
      </div>

      <div className="print-area">
        <table className="client-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Prénom</th>
              <th>Nom</th>
              <th>Téléphone</th>
              <th>Type</th>
              <th>Adresse</th>
              <th>Statut</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentClients.length > 0 ? (
              currentClients.map(client => (
                <tr key={client.id}>
                  <td>{client.id}</td>
                  <td>{client.nom}</td>
                  <td>{client.prenom}</td>
                  <td>{client.telephone}</td>
                  <td>{client.type}</td>
                  <td>{client.adresse}</td>
                  <td>
                    <span className={`status-badge ${client.statut?.toLowerCase()}`}>
                      <span className="status-dot"></span>
                      {client.statut}
                    </span>
                  </td>
                  <td>{new Date(client.created_at).toLocaleDateString('fr-FR')}</td>
                  <td className='action-client'>
                    <button className="btn-view" onClick={() => setSelectedClientId(client.id)}>
                      <GrView /> Voir
                    </button>
                    {selectedClientId && (
                      <ClientDetailModal clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
                    )}
                    <button onClick={() => handleWhatsappClick(client.id)} style={{ backgroundColor: '#25D366', color: 'white', border: 'none', borderRadius: '8px', padding: '0.4rem 0.8rem', cursor: 'pointer' }}>
                      <IoLogoWhatsapp size={20} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="9">Aucun client trouvé</td></tr>
            )}
          </tbody>
        </table>

        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={page === currentPage ? 'active' : ''}
            >
              {page}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AfficherClient;
