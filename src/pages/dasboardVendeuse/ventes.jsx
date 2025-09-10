import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Plus, 
  ShoppingCart, 
  Trash2, 
  Users, 
  UserPlus, 
  Package, 
  Minus,
  Star,
  Filter,
  Search,
  CheckCircle,
  AlertCircle,
  Phone,
  MapPin,
  User
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { RadioGroup, RadioGroupItem } from '../../components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import Swal from 'sweetalert2'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { PRODUCT_BASE_URL } from '../../services/ApiService'
import ApiService from '../../services/ApiService'
import AjouterProduits from './ajouterProduit'

// Types

function VentesApp() {
  const [produits, setProduits] = useState([])
  const [vente, setVente] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [choixClient, setChoixClient] = useState('nouveau')
  const [clients, setClients] = useState([])
  const [client, setClient] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  })
  
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Gestion du thème
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode)
  }, [isDarkMode])

  // Charger les produits au démarrage
  useEffect(() => {
    fetchProduits()
  }, [])

  // Charger les clients
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await ApiService.getClients()
        setClients(response.data)
      } catch (error) {
        console.error('Erreur lors du chargement des clients :', error)
        // En cas d'erreur, utiliser des données vides
        setClients([])
      }
    }
    fetchClients()
  }, [])

  // Fonction pour charger les produits
  const fetchProduits = async () => {
    try {
      const res = await ApiService.getProduits()
      if (Array.isArray(res.data.produits)) {
        setProduits(res.data.produits)
      } else {
        console.error("Les produits ne sont pas un tableau :", res.data)
      }
    } catch (err) {
      console.error("Erreur lors du chargement des produits :", err)
      // En cas d'erreur, utiliser des données vides pour éviter les crashes
      setProduits([])
    }
  }

  const retirerProduit = (produitId) => {
    setVente(prev => prev.filter(p => p.produit_id !== produitId))
  }

  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || produit.categorie === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(produits.map(p => p.categorie).filter(Boolean)))]

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

  const handleQuantiteChange = (produitI, newQuantite) => {
    setVente(prev =>
      prev.map(p =>
        p.produit_id === produitId
          ? { ...p, quantite: newQuantite, montant_total: newQuantite * p.prix_unitaire }
          : p
      )
    )
  }

  const updateQuantite = (produitId, newQuantite) => {
    if (newQuantite <= 0) {
      retirerProduit(produitId)
      return
    }
    handleQuantiteChange(produitId, newQuantite)
  }

  const handleSubmit = async () => {
    const erreurStock = vente.find(p => p.quantite > p.stock)
    if (erreurStock) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: `La quantité demandée (${erreurStock.quantite}) pour le produit "${erreurStock.nom}" dépasse le stock disponible (${erreurStock.stock}).`,
      })
      return
    }

    const payload= {
      produits: vente.map(p => ({
        produit_id: p.produit_id,
        quantite: p.quantite
      }))
    }

    if (client.nom && client.prenom) {
      payload.nom = client.nom
      payload.prenom = client.prenom
      payload.telephone = client.telephone
      payload.adresse = client.adresse
      payload.type = 'particulier'
    } else if (client.client_id) {
      payload.client_id = client.client_id
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Attention',
        text: 'Veuillez renseigner au moins un client.',
      })
      return
    }

    try {
      const res = await ApiService.addVente(payload)
      if (res.status === 201) {
        setVente([])
        setClient({ nom: '', prenom: '', telephone: '', adresse: '' })
        Swal.fire('Succès', 'Vente enregistrée avec succès', 'success')
        fetchProduits() // Recharger les produits pour mettre à jour les stocks
      } else {
        console.error("Erreur lors de l'enregistrement :", res)
        Swal.fire('Erreur', 'Erreur lors de l\'enregistrement', 'error')
      }
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err)
      Swal.fire('Erreur', 'Erreur lors de l\'enregistrement', 'error')
    }
  }

  const totalAmount = vente.reduce((sum, item) => sum + item.montant_total, 0)

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto p-6 space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Interface de Vente
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-purple-300' : 'text-indigo-600'
              }`}>
                Gérez vos ventes avec style et efficacité
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Section des produits */}
          <div className="xl:col-span-2 space-y-6">
            {/* En-tête et filtres */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className={`border-purple-500/20 ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-slate-700/50' 
                  : 'bg-white/90 border-slate-200/50'
              } backdrop-blur-md`}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
                    <div>
                      <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        Catalogue Produits
                      </CardTitle>
                      <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Sélectionnez les produits à vendre
                      </p>
                    </div>
                    <Button
                      onClick={() => setShowModal(true)}
                      className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter Produit
                    </Button>
                  </div>
                  
                  {/* Filtres */}
                  <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                    <div className="relative flex-1">
                      <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-500'
                      }`} />
                      <Input
                        placeholder="Rechercher un produit..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-10 ${
                          isDarkMode 
                            ? 'bg-slate-800/50 border-slate-600' 
                            : 'bg-white/50 border-slate-300'
                        }`}
                      />
                    </div>
                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                      <SelectTrigger className={`w-full md:w-48 ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      }`}>
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(cat => (
                          <SelectItem key={cat} value={cat}>
                            {cat === 'all' ? 'Toutes catégories' : cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>

            {/* Grille des produits */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProduits.map((produit, index) => (
                <motion.div
                  key={produit.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  whileHover={{ scale: 1.02 }}
                  className="group"
                >
                  <Card className={`h-full border-purple-500/20 transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 ${
                    isDarkMode 
                      ? 'bg-slate-900/90 border-slate-700/50 hover:bg-slate-800/90' 
                      : 'bg-white/90 border-slate-200/50 hover:bg-white'
                  } backdrop-blur-md`}>
                    <CardContent className="p-4 space-y-4">
                      <div className="relative aspect-square rounded-xl overflow-hidden">
                        <img
                          src={produit.image ? `${PRODUCT_BASE_URL}/${produit.image}` : 'https://images.unsplash.com/photo-1586806829183-d1bf8382fb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG9wcGluZyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NzQ2NzcyOHww&ixlib=rb-4.1.0&q=80&w=1080'}
                          alt={produit.nom}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className={`${
                            produit.stock > 10 
                              ? 'bg-emerald-500' 
                              : produit.stock > 0 
                                ? 'bg-yellow-500' 
                                : 'bg-red-500'
                          }`}>
                            {produit.stock} en stock
                          </Badge>
                        </div>
                        {produit.rating && (
                          <div className="absolute top-2 left-2 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-white text-sm">{produit.rating}</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <h3 className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          {produit.nom}
                        </h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {produit.prix_unitaire.toLocaleString()} FCFA
                            </p>
                            <p className={`text-sm ${
                              isDarkMode ? 'text-slate-400' : 'text-slate-600'
                            }`}>
                              par {produit.unite}
                            </p>
                          </div>
                          {produit.categorie && (
                            <Badge variant="outline" className="text-xs">
                              {produit.categorie}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        onClick={() => handleSelection(produit)}
                        disabled={produit.stock === 0 || vente.some(v => v.produit_id === produit.id)}
                        className={`w-full transition-all duration-300 ${
                          vente.some(v => v.produit_id === produit.id)
                            ? 'bg-emerald-500 hover:bg-emerald-600'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700'
                        } text-white`}
                      >
                        {vente.some(v => v.produit_id === produit.id) ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Ajouté
                          </>
                        ) : produit.stock === 0 ? (
                          <>
                            <AlertCircle className="h-4 w-4 mr-2" />
                            Rupture de stock
                          </>
                        ) : (
                          <>
                            <Plus className="h-4 w-4 mr-2" />
                            Ajouter au panier
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Panier et informations de vente */}
          <div className="space-y-6">
            <AnimatePresence>
              {vente.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-6"
                >
                  <Card className={`border-purple-500/20 ${
                    isDarkMode 
                      ? 'bg-slate-900/90 border-slate-700/50' 
                      : 'bg-white/90 border-slate-200/50'
                  } backdrop-blur-md`}>
                    <CardHeader>
                      <CardTitle className="text-xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                        Panier ({vente.length} article{vente.length > 1 ? 's' : ''})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Articles du panier */}
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {vente.map((item, index) => (
                          <motion.div
                            key={item.produit_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`p-3 rounded-lg border ${
                              isDarkMode 
                                ? 'bg-slate-800/50 border-slate-600' 
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <h4 className={`font-medium ${
                                isDarkMode ? 'text-white' : 'text-slate-800'
                              }`}>
                                {item.nom}
                              </h4>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => retirerProduit(item.produit_id)}
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantite(item.produit_id, item.quantite - 1)}
                                  className="h-8 w-8"
                                  disabled={item.quantite <= 1}
                                >
                                  <Minus className="h-3 w-3" />
                                </Button>
                                <span className={`w-8 text-center ${
                                  isDarkMode ? 'text-white' : 'text-slate-800'
                                }`}>
                                  {item.quantite}
                                </span>
                                <Button
                                  variant="outline"
                                  size="icon"
                                  onClick={() => updateQuantite(item.produit_id, item.quantite + 1)}
                                  className="h-8 w-8"
                                  disabled={item.quantite >= item.stock}
                                >
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                  {item.montant_total.toLocaleString()} FCFA
                                </p>
                                <p className={`text-xs ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                  {item.prix_unitaire.toLocaleString()} FCFA × {item.quantite}
                                </p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <Separator />

                      {/* Total */}
                      <div className="flex justify-between items-center p-4 rounded-lg bg-gradient-to-r from-purple-600/10 to-pink-600/10 border border-purple-500/20">
                        <span className={`text-lg font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          Total
                        </span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {totalAmount.toLocaleString()} FCFA
                        </span>
                      </div>

                      {/* Informations client */}
                      <div className="space-y-4">
                        <h3 className={`font-semibold ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          Informations Client
                        </h3>

                        <RadioGroup 
                          value={choixClient} 
                          onValueChange={setChoixClient}
                          className="space-y-2"
                        >
                          {clients.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="existant" id="existant" />
                              <Label htmlFor="existant" className="flex items-center space-x-2">
                                <Users className="h-4 w-4" />
                                <span>Client existant</span>
                              </Label>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="nouveau" id="nouveau" />
                            <Label htmlFor="nouveau" className="flex items-center space-x-2">
                              <UserPlus className="h-4 w-4" />
                              <span>Nouveau client</span>
                            </Label>
                          </div>
                        </RadioGroup>

                        {choixClient === 'existant' && clients.length > 0 ? (
                          <Select 
                            value={client.client_id || ''} 
                            onValueChange={(value) => {
                              setClient({ ...client, client_id: value })
                            }}
                          >
                            <SelectTrigger className={
                              isDarkMode 
                                ? 'bg-slate-800/50 border-slate-600' 
                                : 'bg-white/50 border-slate-300'
                            }>
                              <SelectValue placeholder="-- Sélectionner un client --" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.prenom} {c.nom} - {c.telephone}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        ) : (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className={`text-sm ${
                                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                  Nom
                                </Label>
                                <div className="relative">
                                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                  <Input
                                    placeholder="Nom"
                                    value={client.nom}
                                    onChange={(e) => setClient({ ...client, nom: e.target.value })}
                                    className={`pl-10 ${
                                      isDarkMode 
                                        ? 'bg-slate-800/50 border-slate-600' 
                                        : 'bg-white/50 border-slate-300'
                                    }`}
                                  />
                                </div>
                              </div>
                              <div className="space-y-1">
                                <Label className={`text-sm ${
                                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                  Prénom
                                </Label>
                                <Input
                                  placeholder="Prénom"
                                  value={client.prenom}
                                  onChange={(e) => setClient({ ...client, prenom: e.target.value })}
                                  className={
                                    isDarkMode 
                                      ? 'bg-slate-800/50 border-slate-600' 
                                      : 'bg-white/50 border-slate-300'
                                  }
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-1">
                              <Label className={`text-sm ${
                                isDarkMode ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                Téléphone
                              </Label>
                              <PhoneInput
                                country={'sn'} // Sénégal par défaut
                                value={client.telephone}
                                onChange={(phone) => setClient({ ...client, telephone: phone })}
                                containerStyle={{
                                  width: '100%',
                                  border: '1px solid #ccc',
                                  borderRadius: '12px',
                                  backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                                  transition: 'border-color 0.2s ease, background-color 0.2s ease'
                                }}
                                inputStyle={{
                                  width: '100%',
                                  padding: '0.6rem 1rem 0.6rem 3.5rem',
                                  border: 'none',
                                  borderRadius: '12px',
                                  backgroundColor: 'transparent',
                                  color: isDarkMode ? 'white' : '#1e293b'
                                }}
                                buttonStyle={{
                                  border: 'none',
                                  background: 'transparent',
                                  paddingLeft: '0.5rem'
                                }}
                                placeholder="Numéro de téléphone"
                              />
                            </div>
                            
                            <div className="space-y-1">
                              <Label className={`text-sm ${
                                isDarkMode ? 'text-slate-300' : 'text-slate-700'
                              }`}>
                                Adresse
                              </Label>
                              <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                                <Input
                                  placeholder="Adresse complète"
                                  value={client.adresse}
                                  onChange={(e) => setClient({ ...client, adresse: e.target.value })}
                                  className={`pl-10 ${
                                    isDarkMode 
                                      ? 'bg-slate-800/50 border-slate-600' 
                                      : 'bg-white/50 border-slate-300'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        <Button
                          onClick={handleSubmit}
                          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3"
                          disabled={vente.length === 0 || (!client.nom && !client.client_id)}
                        >
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Enregistrer la Vente
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>

            {vente.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center p-8"
              >
                <div className={`p-4 rounded-full mx-auto w-fit mb-4 ${
                  isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'
                }`}>
                  <ShoppingCart className={`h-12 w-12 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                </div>
                <h3 className={`text-xl font-semibold mb-2 ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Panier vide
                </h3>
                <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                  Ajoutez des produits pour commencer une vente
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Modal d'ajout de produit */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <AjouterProduits onClose={() => {
                setShowModal(false)
                fetchProduits()
              }} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default VentesApp