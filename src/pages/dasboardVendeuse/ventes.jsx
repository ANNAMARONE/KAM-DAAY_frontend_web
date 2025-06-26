import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Ventes() {
  const [produits, setProduits] = useState([])
  const [vente, setVente] = useState([])

  useEffect(() => {
    const token = localStorage.getItem('token')
  
    axios.get('http://127.0.0.1:8000/api/produits', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => {
      if (Array.isArray(res.data.produits)) {
        setProduits(res.data.produits) 
        console.log("Produits chargés :", res.data.produits)
      } else {
        console.error("Les produits ne sont pas un tableau :", res.data)
      }
    })
    .catch(err => {
      console.error("Erreur lors du chargement des produits :", err)
    })
  }, [])
  

  const handleSelection = (produit) => {
    const exists = vente.find(p => p.produit_id === produit.id)
    if (!exists) {
      setVente([...vente, {
        produit_id: produit.id,
        quantite: 1,
        prix_unitaire: produit.prix_unitaire,
        montant_total: produit.prix_unitaire
      }])
    }
  }

  const handleSubmit = () => {
    const payload = {
      client_id: 1, // à adapter
      produits: vente
    }

    axios.post('http://127.0.0.1:8000/api/ventes', payload)
      .then(res => {
        alert('Vente enregistrée avec succès !')
        setVente([])
      })
      .catch(err => {
        console.error(err)
        alert('Erreur lors de l\'enregistrement')
      })
  }

  return (
    <div className="vente-container">
      <h2>Liste des Produits</h2>
      <ul>
        {produits.map(produit => (
          <li key={produit.id}>
            {produit.nom} - {produit.prix_unitaire} FCFA / {produit.unite}
            <input
              type="number"
              min="1"
              defaultValue="1"
              onChange={(e) => {
                const qte = parseInt(e.target.value)
                if (qte > 0) {
                  handleSelection({ ...produit, quantite: qte })
                }
              }}
            />
            <span>Quantité</span>
            <img src={produit.image} alt="" />
            <button onClick={() => handleSelection(produit)}>Ajouter</button>
          </li>
        ))}
      </ul>

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
                          handleQuantiteChange(item.produit_id, qte)
                          item.montant_total = qte * item.prix_unitaire
                        }}
                      />
                    </td>
                    <td>{item.prix_unitaire}</td>
                    <td>{(item.quantite * item.prix_unitaire).toFixed(2)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <button onClick={handleSubmit}>Enregistrer la vente</button>
        </>
      )}
    </div>
  )
}

export default Ventes
