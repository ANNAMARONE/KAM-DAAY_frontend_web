import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';
import '../../styles/AfficherVente.css';
import { PRODUCT_BASE_URL } from '../../services/ApiService';
import { FaSmile, FaFrown } from 'react-icons/fa';
import {NavLink, useNavigate } from 'react-router-dom';
import {MdOutlineFilterList } from "react-icons/md";
import { MdOutlineArrowBackIos} from "react-icons/md";
import '../../styles/theme.css';
import Swal from 'sweetalert2';

function AfficherVente() {
  const [ventes, setVentes] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null); 
  const navigate = useNavigate()
  useEffect(() => {
    ApiService.getMesVentes()
      .then(response => {
        setVentes(response.data.data);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des ventes:', error);
      });
  }, []);

  const noterFeedback = async (venteId, satisfait) => {
    try {
      const res = await ApiService.noterVente(venteId, satisfait);
      setVentes(prev =>
        prev.map(v =>
          v.id === venteId ? { ...v, feedback: res.data.data } : v
        )
      );
      setOpenDropdownId(null); 
    } catch (err) {
      console.error('Erreur lors de la notation :', err.response?.data?.message);
      alert(err.response?.data?.message || 'Erreur lors de la notation.');
    }
  };

  const supprimerVente = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Supprimer cette vente ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler'
    });
  
    if (!confirmation.isConfirmed) return;
  
    try {
      await ApiService.supprimerVente(id);
      setVentes(prev => prev.filter(v => v.id !== id));
  
      Swal.fire({
        icon: 'success',
        title: 'Vente supprimée',
        text: 'La vente a été supprimée avec succès.',
        timer: 2000,
        showConfirmButton: false
      });
    } catch (error) {
      console.error('Erreur suppression vente', error);
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible de supprimer la vente.",
      });
    }
  };
  

  const toggleDropdown = (id) => {
    setOpenDropdownId(prev => (prev === id ? null : id));
  };

  return (
    <div className="vente-container">
    <div className="ventes-header">
    <button className="btn-back" onClick={() => navigate(-1)}>
            <MdOutlineArrowBackIos />
          </button>
        <h2>Mes Ventes</h2>
        <div className="ventes-actions">
        <button className="btn-filtrer">
          <MdOutlineFilterList size={20} /> Filtrer
        </button>

         <NavLink to='/ventes'>
         <button className="btn-ajouter">Ajouter une vente</button>
         </NavLink>
         
          
        </div>
      </div>

     
      <div className='listeVente'>
        {ventes.map((vente) => {
          const client = vente.client || {};
          const totalMontant = vente.produits.reduce((acc, p) => acc + parseFloat(p.pivot.montant_total), 0);

          return (
            <div key={vente.id} className="carte-vente">
              <h3>Client : {client.nom} {client.prenom}</h3>
              <p>Date : {new Date(vente.created_at).toLocaleDateString()}</p>

              <table className="vente-table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th>Quantité</th>
                    <th>Prix Unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {vente.produits.map(produit => (
                    <tr key={produit.id}>
                      <td><img
                        src={`${PRODUCT_BASE_URL}/${produit.image}`}
                        alt={produit.nom}
                        width="50"
                        height="50"
                      /></td>
                      <td>{produit.pivot.quantite} {produit.unite}</td>
                      <td>{parseFloat(produit.pivot.prix_unitaire).toLocaleString()} FCFA</td>
                      <td>{parseFloat(produit.pivot.montant_total).toLocaleString()} FCFA</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Total Vente</strong></td>
                    <td style={{ fontWeight: 'bold', background: '#FDEEB7' }}><strong>{totalMontant.toLocaleString()} FCFA</strong></td>
                  </tr>
                </tfoot>
              </table>

              <div className='footer-cart'>
                <div className="satisfaction-section">
                  {vente.feedback ? (
                    vente.feedback.satisfait ? (
                      <FaSmile color="green" title="Satisfait"  />
                    ) : (
                      <FaFrown color="red" title="Non satisfait" />
                    )
                  ) : (
                    <div className="dropdown">
                      <button className="dropdown-toggle" onClick={() => toggleDropdown(vente.id)}>
                        Noter ici
                      </button>
                      {openDropdownId === vente.id && (
                        <div className="dropdown-menu">
                          <button onClick={() => noterFeedback(vente.id, 1)}>Satisfait</button>
                          <button onClick={() => noterFeedback(vente.id, 0)}>Non satisfait</button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button onClick={() => supprimerVente(vente.id)} className="btn-supprimer">
                  Supprimer
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AfficherVente;
