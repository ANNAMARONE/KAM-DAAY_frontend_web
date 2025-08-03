import React, { useEffect, useState } from 'react';
import { useNavigate,NavLink } from 'react-router-dom'
import ApiService from '../../services/ApiService' 
import '../../styles/afficherClient.css'
import { MdOutlineArrowBackIos, MdOutlineFilterList } from "react-icons/md";
import { FaSearch, FaPrint } from 'react-icons/fa'
import { AiOutlineClose } from "react-icons/ai";
import { FcPhone } from "react-icons/fc";
import { IoLogoWhatsapp, IoMdPersonAdd } from "react-icons/io";
import { TfiExport } from "react-icons/tfi";
import ClientDetailModal from './ClientDetailModal';
import '../../styles/gestionClient.css'
import { GrView } from "react-icons/gr";
import '../../styles/theme.css';
import ClientEditModal from './ClientEditModal';
import Swal from 'sweetalert2';
<<<<<<< HEAD

=======
import { CiImport } from "react-icons/ci";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
>>>>>>> develop
function GestionClient() {
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
  const [editClientId, setEditClientId] = useState(null);

  const clientsPerPage = 7;
// Pagination logic
const totalPages = Math.ceil(filteredClients.length / clientsPerPage);
const indexOfLastClient = currentPage * clientsPerPage;
const indexOfFirstClient = indexOfLastClient - clientsPerPage;
const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient);
  
  const navigate = useNavigate();

 
  const fetchClients = async () => {
    try {
      const response = await ApiService.getClients();
      setClients(response.data);
      setFilteredClients(response.data);
    } catch (err) {
      console.error('Erreur lors du chargement des clients', err);
    }
  };

  useEffect(() => {
    fetchClients(); 
  }, []);

  // Fonction de filtrage combiné (statut + dates + recherche)
  useEffect(() => {
    let filtered = clients;

    if (filterStatut) {
      filtered = filtered.filter(client => client.statut === filterStatut);
    }

    // Filtre dates
    if (startDate) {
      filtered = filtered.filter(client => new Date(client.created_at) >= new Date(startDate));
    }
    if (endDate) {
      filtered = filtered.filter(client => new Date(client.created_at) <= new Date(endDate));
    }

    // Filtre recherche texte (sur prénom, nom, téléphone...)
 
    setFilteredClients(filtered);
  }, [clients, filterStatut, startDate, endDate]);

  const handleToggleFilter = () => {
    setShowFilter(!showFilter);
  };
  //recherche des clients par nom, prénom 
  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients); 
      return;
    }
  
    try {
      const response = await ApiService.searchClients(searchTerm);
      setFilteredClients(response.data);
    } catch (error) {
      console.error('Erreur lors de la recherche de clients', error);
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
  

  // Fonction pour gérer l'exportation par pdf
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
      console.error('Erreur export', error);
    }
  };
  // Fonction pour imprimer la liste des clients
  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = 'Liste_des_clients'; 
  
    window.print();
  
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

//fonctionnalite pour supprimer un client
const handleDelete = async (id) => {
  const result = await Swal.fire({
    title: 'Êtes-vous sûr ?',
    text: 'Ce client sera définitivement supprimé.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler'
  });

  if (result.isConfirmed) {
    try {
      await ApiService.deleteClient(id);
      fetchClients();
      Swal.fire({
        icon: 'success',
        title: 'Supprimé !',
        text: 'Le client a été supprimé avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur suppression client', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'La suppression du client a échoué.',
      });
    }
  }
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
          <NavLink to='/client/supprimer'> <button>
            clients supprimer
          </button>
          </NavLink>
        </div>
      </div>

      <div className="header-tools">
        <div className="filter-container">
        <div className='buttonFilter'>
        <div>
         <label htmlFor="filterStatut">Filtrer par statut :</label><br />
          <select
            id="filterStatut"
            value={filterStatut}
            onChange={e => setFilterStatut(e.target.value)}
          >
            <option value="">Tous</option>
            <option value="actif">Actif</option>
            <option value="inactif">Inactif</option>
          </select>
         </div>
         <div className='filterDate'>
         <label htmlFor="filterDate">Filter par date</label>
          <button 
            onClick={handleToggleFilter}
            style={{ display: "flex", alignItems: "center", gap: 5, marginLeft: 10 }}
          >
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
              <label htmlFor="endDate" style={{ marginLeft: 10 }}>
                Date de fin :
              </label>
              <input
                type="date"
                id="endDate"
                value={endDate}
                onChange={e => setEndDate(e.target.value)}
              />
              <button
                className="btn-filter"
                onClick={() => setShowFilter(false)}
                style={{ marginLeft: 10 }}
              >
                Appliquer
              </button>
            </div>
          )}
        </div>

        <div className='button_Action'>
          <button className="btn-add-client" onClick={() => navigate('/Ajouter client')}>
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
      <button className="btn-print" onClick= {handlePrint}>
      <CiImport  /> Importer
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
          {filteredClients.length > 0 ? (
            currentClients.map(client => (
              <tr key={client.id}>
                <td>{client.id}</td>
                <td>{client.nom}</td>
                <td>{client.prenom}</td>
                <td>{client.telephone}</td>
                <td>{client.type}</td>
                <td>{client.adresse}</td>
                <td>
                <span className={`status-badge ${client.statut.toLowerCase()}`}>
                  <span className="status-dot"></span>
                  {client.statut}
                </span>
              </td>

                <td>{new Date(client.created_at).toLocaleDateString('fr-FR')}</td>
                <td className='action-client'>
                <button className="btn-view" onClick={() => setSelectedClientId(client.id)}><GrView /></button>
                {selectedClientId && (
      <ClientDetailModal clientId={selectedClientId} onClose={() => setSelectedClientId(null)} />
    )}
<<<<<<< HEAD
           <button className="btn-update" onClick={() => setEditClientId(client.id)}>
            modifier
          </button>
     
           <button  onClick={() => handleDelete(client.id)} className="btn-delate">supprimer</button>
=======
           <button className="btn-update" onClick={() => setEditClientId(client.id) }>
           <FaEdit />
          </button>
     
           <button  onClick={() => handleDelete(client.id)} className="btn-delate"><MdDelete /></button>
>>>>>>> develop
           
                </td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="9">Aucun client trouvé</td></tr>
          )}
        </tbody>
      </table>
      {editClientId && (
  <ClientEditModal
    clientId={editClientId}
    onClose={() => setEditClientId(null)}
    onRefresh={fetchClients}
  />
)}

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


export default GestionClient