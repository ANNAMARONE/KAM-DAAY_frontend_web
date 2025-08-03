import React, { useEffect, useState } from 'react'
import { PRODUCT_BASE_URL } from '../../services/ApiService'
import ApiService from '../../services/ApiService'
import '../../styles/ventes.css'
import AjouterProduits from './ajouterProduit'
import '../../styles/theme.css';
import Swal from 'sweetalert2';
function Ventes() {
  const [produits, setProduits] = useState([])
  const [vente, setVente] = useState([])
  const [showModal, setShowModal] = useState(false)
  const erreurStock = vente.find(p => p.quantite > p.stock);
  const retirerProduit = (produitId) => {
    setVente(prev => prev.filter(p => p.produit_id !== produitId));
  };
  const [choixClient, setChoixClient] = useState('nouveau');
  const [clients, setClients] = useState([]);
  const [client, setClient] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  })
  useEffect(() => {
    fetchProduits()
  }, [])
  
  const fetchProduits = async () => {
    try {
      const res = await ApiService.getProduits()
      if (Array.isArray(res.data.produits)) {
        setProduits(res.data.produits)
        console.log("Produits chargés :", res.data.produits)
      } else {
        console.error("Les produits ne sont pas un tableau :", res.data)
      }
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err)
    }
  }

  const handleSelection = (produit) => {
    const exists = vente.find(p => p.produit_id === produit.id)
    if (!exists) {
      setVente([...vente, {
        produit_id: produit.id,
        nom: produit.nom, 
        stock: produit.stock, 
        quantite: 1,
        prix_unitaire: produit.prix_unitaire,
        montant_total: produit.prix_unitaire * 1
      }])
    }
  }
  

  const handleQuantiteChange = (produitId, newQuantite) => {
    setVente(prev =>
      prev.map(p =>
        p.produit_id === produitId
          ? { ...p, quantite: newQuantite, montant_total: newQuantite * p.prix_unitaire }
          : p
      )
    )
  }

  const handleSubmit = async () => {
    
    const erreurStock = vente.find(p => p.quantite > p.stock);
    if (erreurStock) {
    
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: (`La quantité demandée (${erreurStock.quantite})
         pour le produit "${erreurStock.nom}" dépasse le stock disponible
          (${erreurStock.stock}).`),
      });
      return;
    }
  
    const payload = {
      produits: vente.map(p => ({
        produit_id: p.produit_id,
        quantite: p.quantite
      }))
    };
  
    // Ajout des infos client
    if (client.nom && client.prenom) {
      payload.nom = client.nom;
      payload.prenom = client.prenom;
      payload.telephone = client.telephone;
      payload.adresse = client.adresse;
      payload.type = 'particulier';
    } else if (client.client_id) {
      payload.client_id = client.client_id;
    } else {
      alert("Veuillez renseigner au moins un client.");
      return;
    }
  
    try {
      const res = await ApiService.addVente(payload);
      if (res.status === 201) {
        console.log("Vente enregistrée avec succès");
        setVente([]);
        setClient({ nom: '', prenom: '', telephone: '', adresse: '' });
        Swal.fire('Succès', 'Vente enregistrée avec succès', 'success');
     
       
      } else {
        console.error("Erreur lors de l'enregistrement :", res.data);
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
      Swal.fire('Erreur', 'Erreur lors de l\'enregistrement :', 'error');
    }
  }
  
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.getClients();
        setClients(response.data); // ou response directement selon ton ApiService
      } catch (error) {
        console.error('Erreur lors du chargement des clients :', error);
      }
    };
  
    fetchClients();
  }, []);
  

  return (
    <div className="vente-container">
   <div className="produit-entete">
  <div>
    
    <h2>Liste des Produits</h2>
    <p>Veuillez sélectionner les produits à vendre.</p>
  </div>
  {showModal && (
  <div className="modal-backdrop">
    <div className="modal">
      <button
        onClick={() => setShowModal(false)}
        className="close-modal-btn"
        style={{
          position: 'absolute',
          top: '10px',
          right: '15px',
          background: 'none',
          border: 'none',
          fontSize: '1.5rem',
          cursor: 'pointer'
        }}
      >
        &times;
      </button>
      <AjouterProduits
        onClose={() => {
          setShowModal(false)
          fetchProduits() // recharge la liste après ajout
        }}
      />
    </div>
  </div>
)}
  <button className="btn-ajouter" onClick={() => setShowModal(true)}>
    Ajouter un Produit
  </button>

</div>

   <div className='list-produit'>
   <ul className='produitListe'>
        {produits.map(produit => (
          <li key={produit.id}>
            <img
              src={`${PRODUCT_BASE_URL}/${produit.image}`}
              alt={produit.nom}
              width="100"
              height="100"
            />
            <div>
              <p>{produit.nom}</p>  
              <p>{produit.prix_unitaire} FCFA / {produit.unite}</p>
           
              <button onClick={() => handleSelection(produit)}>Ajouter</button>
            </div>
          </li>
        ))}
      </ul>
   </div>

     <div className='infoVente'>
     {vente.length > 0 && (
        <>
          <h3>Produits sélectionnés</h3>
          <table>
            <thead>
              <tr>
                <th>Nom</th>
                <th>Quantité</th>
                <th>Prix unitaire</th>
                <th>Montant total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {vente.map((item, index) => {
                const produit = produits.find(p => p.id === item.produit_id)
                return (
                  <tr key={index}>
                    <td>{produit?.nom}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantite}
                        min={1}
                        onChange={(e) => {
                          const qte = parseInt(e.target.value)
                          if (qte > 0) handleQuantiteChange(item.produit_id, qte)
                        }}
                      />
                    </td>
                    <td>{item.prix_unitaire}</td>
                    <td>{(item.quantite * item.prix_unitaire).toFixed(2)}</td>
                    <td>
                    <button onClick={() => retirerProduit(item.produit_id)} className="btn-retirer">
                    🗑
                    </button>
                  </td>
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
  <tr style={{ fontWeight: 'bold', background: '#FDEEB7' }}>
    <td colSpan="4">Total</td>
    <td>
      {vente.reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0).toFixed(2)} FCFA
    </td>
  </tr>
</tfoot>

          </table>
          <h3>Informations du Client</h3>
<<<<<<< HEAD
          <div className="choix-client">
  <label>
    <input
      type="radio"
      name="choixClient"
      value="existant"
      checked={choixClient === 'existant'}
      onChange={() => setChoixClient('existant')}
    />
    Client existant
  </label>
=======

<div className="choix-client">
  {/* Affiche "Client existant" uniquement s'il y a des clients */}
  {clients.length > 0 && (
    <label>
      <input
        type="radio"
        name="choixClient"
        value="existant"
        checked={choixClient === 'existant'}
        onChange={() => setChoixClient('existant')}
      />
      Client existant
    </label>
  )}

  {/* Ce bouton est toujours visible */}
>>>>>>> develop
  <label>
    <input
      type="radio"
      name="choixClient"
      value="nouveau"
      checked={choixClient === 'nouveau'}
      onChange={() => setChoixClient('nouveau')}
    />
    Nouveau client
  </label>
<<<<<<< HEAD
</div>

{choixClient === 'existant' ? (
  <select
    value={client.client_id}
    onChange={(e) => setClient({ ...client, client_id: e.target.value })}
  >
    <option value="">-- Sélectionner un client --</option>
    {clients.map((c) => (
      <option key={c.id} value={c.id}>
        {c.prenom} {c.nom} - {c.telephone}
      </option>
    ))}
  </select>
) : (
<div className="form-client">
  <input
    type="text"
    placeholder="Nom"
    value={client.nom}
    onChange={(e) => setClient({ ...client, nom: e.target.value })}
  />
  <input
    type="text"
    placeholder="Prénom"
    value={client.prenom}
    onChange={(e) => setClient({ ...client, prenom: e.target.value })}
  />
  <input
    type="tel"
    placeholder="Téléphone"
    value={client.telephone}
    onChange={(e) => setClient({ ...client, telephone: e.target.value })}
  />
  <input
    type="text"
    placeholder="Adresse"
    value={client.adresse}
    onChange={(e) => setClient({ ...client, adresse: e.target.value })}
  />
</div>
)}
=======
</div>

{/* Affichage du formulaire selon le choix */}
{choixClient === 'existant' && clients.length > 0 ? (
  <select
    value={client.client_id}
    onChange={(e) => setClient({ ...client, client_id: e.target.value })}
  >
    <option value="">-- Sélectionner un client --</option>
    {clients.map((c) => (
      <option key={c.id} value={c.id}>
        {c.prenom} {c.nom} - {c.telephone}
      </option>
    ))}
  </select>
) : (
  <div className="form-client">
    <input
      type="text"
      placeholder="Nom"
      value={client.nom}
      onChange={(e) => setClient({ ...client, nom: e.target.value })}
    />
    <input
      type="text"
      placeholder="Prénom"
      value={client.prenom}
      onChange={(e) => setClient({ ...client, prenom: e.target.value })}
    />
    <input
      type="tel"
      placeholder="Téléphone"
      value={client.telephone}
      onChange={(e) => setClient({ ...client, telephone: e.target.value })}
    />
    <input
      type="text"
      placeholder="Adresse"
      value={client.adresse}
      onChange={(e) => setClient({ ...client, adresse: e.target.value })}
    />
  </div>
)}



>>>>>>> develop
          <button onClick={handleSubmit}>Enregistrer la vente</button>
        </>
      )}
     </div>
    </div>
  )
}

export default Ventes
