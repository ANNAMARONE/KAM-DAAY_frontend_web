import React, { useEffect, useState } from 'react'
import { PRODUCT_BASE_URL } from '../../services/ApiService'
import ApiService from '../../services/ApiService'
import '../../styles/ventes.css'

function Ventes() {
  const [produits, setProduits] = useState([])
  const [vente, setVente] = useState([])
  const [client, setClient] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  })
  useEffect(() => {
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

    fetchProduits()
  }, [])

  const handleSelection = (produit) => {
    const exists = vente.find(p => p.produit_id === produit.id)
    if (!exists) {
      setVente([...vente, {
        produit_id: produit.id,
        quantite: produit.quantite || 1,
        prix_unitaire: produit.prix_unitaire,
        montant_total: produit.prix_unitaire * (produit.quantite || 1)
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
    const payload = {
      produits: vente.map(p => ({
        produit_id: p.produit_id,
        quantite: p.quantite
      }))
    }
  
    // Cas 1 : nouveau client
    if (client.nom && client.prenom) {
      payload.nom = client.nom
      payload.prenom = client.prenom
      payload.telephone = client.telephone
      payload.adresse = client.adresse
      payload.type = 'particulier'
    }
    // Cas 2 : client existant (dans un futur select dropdown)
    else if (client.client_id) {
      payload.client_id = client.client_id
    }
    // Cas 3 : rien du tout — erreur utilisateur
    else {
      alert("Veuillez renseigner au moins un client.")
      return
    }
  
    try {
      const res = await ApiService.addVente(payload)
      if (res.status === 201) {
        console.log("✅ Vente enregistrée avec succès")
        setVente([])
        setClient({ nom: '', prenom: '', telephone: '', adresse: '' })
      } else {
        console.error("❌ Erreur lors de l'enregistrement :", res.data)
      }
    } catch (err) {
      console.error("❌ Erreur lors de l'enregistrement :", err)
    }
  }
  

  return (
    <div className="vente-container">
   <div className="produit-entete">
  <div>
    <h2>Liste des Produits</h2>
    <p>Veuillez sélectionner les produits à vendre.</p>
  </div>
  <button>Ajouter un produit</button>
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
                  </tr>
                )
              })}
            </tbody>
            <tfoot>
  <tr style={{ fontWeight: 'bold', background: '#f3fef5' }}>
    <td colSpan="3">Total</td>
    <td>
      {vente.reduce((sum, item) => sum + item.quantite * item.prix_unitaire, 0).toFixed(2)} FCFA
    </td>
  </tr>
</tfoot>

          </table>
          <h3>Informations du Client</h3>
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

          <button onClick={handleSubmit}>Enregistrer la vente</button>
        </>
      )}
     </div>
    </div>
  )
}

export default Ventes
