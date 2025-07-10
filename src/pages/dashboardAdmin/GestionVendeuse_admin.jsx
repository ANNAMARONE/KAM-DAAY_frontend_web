import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../../services/ApiService';
import '../../styles/theme.css';
import '../../index.css';
import '../../styles/gestionvendeuse.css';
import { MdOutlineArrowBackIos, MdOutlineFilterList } from 'react-icons/md';
import { FaSearch, FaPrint } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { IoMdPersonAdd } from 'react-icons/io';
import { TfiExport } from 'react-icons/tfi';
import { FiEye, FiEdit, FiTrash2 } from 'react-icons/fi';

function GestionVendeuse_admin() {
  const [vendeuses, setVendeuses] = useState([]);
  const [filteredVendeuses, setFilteredVendeuses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatut, setFilterStatut] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showExportOptions, setShowExportOptions] = useState(false);

  const navigate = useNavigate();
  const clientsPerPage = 7;
  const totalPages = Math.ceil(filteredVendeuses.length / clientsPerPage);
  const indexOfLast = currentPage * clientsPerPage;
  const indexOfFirst = indexOfLast - clientsPerPage;
  const currentVendeuses = filteredVendeuses.slice(indexOfFirst, indexOfLast);

  useEffect(() => {
    fetchVendeuses();
  }, []);

  const fetchVendeuses = async () => {
    try {
      const response = await ApiService.getVendeuses();
      const data = response.data.vendeuses || response.data;
      setVendeuses(data);
      setFilteredVendeuses(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des vendeuses:', error);
    }
  };

  const applyFilters = () => {
    let filtered = [...vendeuses];

    if (filterStatut) {
      filtered = filtered.filter(v =>
        v.statut?.toLowerCase() === filterStatut.toLowerCase()
      );
    }

    if (startDate) {
      filtered = filtered.filter(v =>
        new Date(v.created_at) >= new Date(startDate)
      );
    }

    if (endDate) {
      filtered = filtered.filter(v =>
        new Date(v.created_at) <= new Date(endDate)
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(v =>
        v.username?.toLowerCase().includes(term) ||
        v.telephone?.includes(term) ||
        v.localite?.toLowerCase().includes(term) ||
        v.GIE?.toLowerCase().includes(term)
      );
    }

    setFilteredVendeuses(filtered);
  };

  useEffect(() => {
    applyFilters();
  }, [vendeuses, filterStatut, startDate, endDate]);

  const handleSearch = () => {
    applyFilters();
  };

  const clearSearch = () => {
    setSearchTerm('');
    applyFilters();
  };

  const handleExport = async (format) => {
    try {
      const response = await ApiService.exportClients(format);
      const blob = new Blob([response.data], {
        type: format === 'pdf' ? 'application/pdf' : 'text/csv',
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vendeuses.${format}`;
      link.click();
    } catch (error) {
      console.error('Erreur export', error);
    }
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = 'Liste_des_vendeuses';
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

  const toggleStatut = async (id, index, currentStatut) => {
    try {
      const statutMin = (currentStatut || '').toLowerCase();
      if (statutMin === 'actif') {
        await ApiService.desactiveVendeuse(id);
      } else {
        await ApiService.activeVendeuse(id);
      }
      const updated = [...vendeuses];
      updated[index].statut = statutMin === 'actif' ? 'inactif' : 'actif';
      setVendeuses(updated);
    } catch (error) {
      console.error("Erreur lors de la mise à jour du statut de la vendeuse:", error);
    }
  };

  return (
    <div>
      <h1>Gestion des vendeuses</h1>
      <div className='headervendeuseListe'>
        <div className='headerTopLeft_vendeuse'>
          <button className="btn-back" onClick={() => navigate(-1)}>
            <MdOutlineArrowBackIos />
          </button>
          <h1>Liste des Vendeuses</h1>
        </div>

        <div className="search-table_vendeuse">
          <input
            className='search-input-vendeuse'
            type="text"
            placeholder="Rechercher..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-button_vendeuse" onClick={handleSearch}>
            <FaSearch />
          </button>
          <button className="close-button_vendeuse" onClick={clearSearch}>
            <AiOutlineClose />
          </button>
        </div>
      </div>

      <div className="header-tools_vendeuse">
        <div className="filter-container_vendeuse">
          <div className='buttonFilter_vendeuse'>
            <div>
              <label htmlFor="filterStatut_vendeuse">Filtrer par statut :</label><br />
              <select
                id="filterStatut_vendeuse"
                value={filterStatut}
                onChange={e => setFilterStatut(e.target.value)}
              >
                <option value="">Tous</option>
                <option value="actif">Actif</option>
                <option value="inactif">Inactif</option>
              </select>
            </div>
            <div>
              <label>Filtrer par date :</label><br />
              <button onClick={() => setShowFilter(!showFilter)} className="btn-toggle-date-filter">
                <MdOutlineFilterList /> Dates
              </button>
            </div>
          </div>

          {showFilter && (
            <div className="date-filter-container">
              <label>Date de début :</label>
              <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              <label>Date de fin :</label>
              <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              <button onClick={() => setShowFilter(false)}>Appliquer</button>
            </div>
          )}
        </div>

        <div className='button_Action_vendeuse'>
          <button onClick={() => navigate('/ventes')}>
            <IoMdPersonAdd /> Vendeuse
          </button>
          <div className="export-dropdown">
            <button onClick={() => setShowExportOptions(!showExportOptions)}>
              <TfiExport /> Exporter
            </button>
            {showExportOptions && (
              <div className="export-options">
                <button onClick={() => handleExport('pdf')}>PDF</button>
                <button onClick={() => handleExport('csv')}>CSV</button>
              </div>
            )}
          </div>
          <button onClick={handlePrint}>
            <FaPrint /> Imprimer
          </button>
        </div>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nom</th>
            <th>Téléphone</th>
            <th>Adresse</th>
            <th>GIE</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentVendeuses.map((vendeuse, index) => {
            const statutMin = vendeuse.statut?.toLowerCase() || 'inactif';
            const isActif = statutMin === 'actif';
            return (
              <tr key={vendeuse.id}>
                <td>{vendeuse.id}</td>
                <td>{vendeuse.username}</td>
                <td>{vendeuse.telephone}</td>
                <td>{vendeuse.localite}</td>
                <td>{vendeuse.GIE}</td>
                <td>
                  <input
                    type="checkbox"
                    checked={isActif}
                    onChange={() => toggleStatut(vendeuse.id, index, statutMin)}
                  />
                  <span className={`Vendeuse-statut ${isActif ? 'statut-actif' : 'statut-inactif'}`}>
                    {isActif ? 'actif' : 'inactif'}
                  </span>
                </td>
                <td>
                <button
                  title="Détail"
                  className="action-btn detail-btn"
                  onClick={() => navigate(`/vendeuses/${vendeuse.id}`)}
                >
                  <FiEye />
                </button>

                  <button title="Modifier" className="action-btn edit-btn">
                    <FiEdit />
                  </button>
                  <button title="Supprimer" className="action-btn delete-btn">
                    <FiTrash2 />
                  </button>
                </td>
              </tr>
            );
          })}
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
  );
}

export default GestionVendeuse_admin;
