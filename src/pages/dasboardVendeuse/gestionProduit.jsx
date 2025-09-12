import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  DollarSign, 
  Hash, 
  Search, 
  Filter,
  Upload,
  Save,
  X,
  Loader2,
  AlertTriangle,
  CheckCircle,
  Eye,
  Star,
  TrendingUp,
  BarChart3,
  Archive
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from '../../components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip'
import ApiService from '../../services/ApiService';
import { PRODUCT_BASE_URL } from '../../services/ApiService';
import Swal from 'sweetalert2'
import '../../index.css'


function ResponsiveGestionProduits() {
  const [produits, setProduits] = useState([])
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    prix_unitaire: '',
    unite: 'pièce',
    stock: '',
    image: null
  })

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  useEffect(() => {
    fetchProduits()
  }, [])

  const fetchProduits = async () => {
    setLoading(true)
    try {
      const res = await ApiService.getProduits()
      if (Array.isArray(res.data.produits)) {
        setProduits(res.data.produits)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les produits'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.nom || !formData.prix_unitaire || !formData.unite || !formData.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs obligatoires.'
      })
      return
    }

    setSaving(true)

    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) data.append(key, value)
      })

      if (editId) {
        await ApiService.updateProduit(editId, data)
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Produit modifié avec succès!'
        })
      } else {
        await ApiService.addProduit(data)
        Swal.fire({
          icon: 'success',
          title: 'Succès',
          text: 'Produit ajouté avec succès!'
        })
      }

      await fetchProduits()
      resetForm()
      setShowModal(false)
    } catch (err) {
      console.error('Erreur:', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de l\'opération'
      })
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (produit) => {
    setEditId(produit.id)
    setFormData({
      nom: produit.nom,
      prix_unitaire: produit.prix_unitaire.toString(),
      unite: produit.unite,
      stock: produit.stock.toString(),
      image: null
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Ce produit sera définitivement supprimé.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1e293b'
    })

    if (result.isConfirmed) {
      try {
        await ApiService.supprimerProduit(id)
        await fetchProduits()
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Le produit a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Erreur suppression produit', error)
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La suppression du produit a échoué.'
        })
      }
    }
  }

  const handleStockUpdate = async (id, newStock) => {
    if (isNaN(newStock) || newStock < 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Stock invalide',
        text: 'Veuillez entrer un nombre entier valide.'
      })
      return
    }

    try {
      await ApiService.updateStock(id, { stock: newStock })
      await fetchProduits()
      Swal.fire({
        icon: 'success',
        title: 'Stock mis à jour',
        text: 'Le stock a été mis à jour avec succès.',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Erreur API:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur de mise à jour du stock.'
      })
    }
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      prix_unitaire: '',
      unite: 'pièce',
      stock: '',
      image: null
    })
    setEditId(null)
  }

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR')
  }

  const getStockStatus = (stock) => {
    if (stock === 0) return { color: 'bg-red-500', text: 'Rupture' }
    if (stock <= 10) return { color: 'bg-yellow-500', text: 'Faible' }
    return { color: 'bg-emerald-500', text: 'Bon' }
  }

  const filteredProduits = produits.filter(produit => {
    const matchesSearch = produit.nom.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || produit.categorie === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(produits.map(p => p.categorie).filter(Boolean)))]
  const totalProduits = produits.length
  const totalStock = produits.reduce((sum, p) => sum + p.stock, 0)
  const produitsEnRupture = produits.filter(p => p.stock === 0).length
  const valeurStock = produits.reduce((sum, p) => sum + (p.prix_unitaire * p.stock), 0)

  // Composant Card Produit pour mobile
  const ProduitCard = ({ produit, index }) => {
    const stockStatus = getStockStatus(produit.stock)
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.02 }}
        className={`p-4 rounded-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/60 border border-slate-600/30 hover:bg-slate-700/40' 
            : 'bg-white/60 border border-slate-200/50 hover:bg-slate-50/80'
        }`}
      >
        {/* Header avec image et infos principales */}
        <div className="flex items-start space-x-4 mb-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
            <img
              src={produit.image ? `${PRODUCT_BASE_URL}/${produit.image}` : 'https://images.unsplash.com/photo-1586806829183-d1bf8382fb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG9wcGluZyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NzQ2NzcyOHww&ixlib=rb-4.1.0&q=80&w=1080'}
              alt={produit.nom}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className={`text-lg mb-1 truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {produit.nom}
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
              {produit.categorie && (
                <Badge variant="outline" className="text-xs">
                  {produit.categorie}
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                {produit.unite}
              </Badge>
            </div>
            {produit.rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className={`text-xs ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {produit.rating}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Informations détaillées */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Prix unitaire:
            </span>
            <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
              {formatAmount(produit.prix_unitaire)} FCFA
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Stock:
            </span>
            <div className="flex items-center space-x-2">
              <span className={`font-bold text-lg ${
                produit.stock === 0 
                  ? 'text-red-500' 
                  : produit.stock <= 10 
                    ? 'text-yellow-500' 
                    : 'text-emerald-500'
              }`}>
                {produit.stock}
              </span>
              <Badge className={`${stockStatus.color} text-white text-xs`}>
                {stockStatus.text}
              </Badge>
            </div>
          </div>
        </div>

        {/* Ajuster Stock Mobile */}
        <div className="mb-4">
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Nouveau stock"
              className={`flex-1 h-8 text-sm ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-600' 
                  : 'bg-white/50 border-slate-300'
              }`}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const input = e.target
                  const newStock = parseInt(input.value)
                  if (!isNaN(newStock)) {
                    handleStockUpdate(produit.id, newStock)
                    input.value = ''
                  }
                }
              }}
            />
            <Button
              size="sm"
              variant="outline"
              onClick={(e) => {
                const input = e.target.parentElement?.querySelector('input')
                const newStock = parseInt(input.value)
                if (!isNaN(newStock)) {
                  handleStockUpdate(produit.id, newStock)
                  input.value = ''
                }
              }}
              className="h-8 px-2"
            >
              <CheckCircle className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEdit(produit)}
                  className={`h-8 w-8 p-0 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 ${
                    isDarkMode ? 'border-slate-600' : 'border-slate-300'
                  }`}
                >
                  <Edit className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Modifier</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDelete(produit.id)}
                  className={`h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 ${
                    isDarkMode ? 'border-slate-600' : 'border-slate-300'
                  }`}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Supprimer</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>
    )
  }

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-4"
        >
          <Loader2 className={`h-12 w-12 animate-spin mx-auto ${
            isDarkMode ? 'text-purple-400' : 'text-purple-600'
          }`} />
          <p className={`text-lg ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Chargement des produits...
          </p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="container mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* En-tête - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2 sm:space-y-4"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
            <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Gestion des Produits
              </h1>
              <p className={`text-sm sm:text-base lg:text-lg ${
                isDarkMode ? 'text-purple-300' : 'text-indigo-600'
              }`}>
                Gérez votre catalogue et vos stocks
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
        >
          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 w-fit mx-auto mb-3 sm:mb-4">
                <Package className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {totalProduits}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Produits au catalogue
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 w-fit mx-auto mb-3 sm:mb-4">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {totalStock}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Unités en stock
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 w-fit mx-auto mb-3 sm:mb-4">
                <AlertTriangle className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {produitsEnRupture}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Ruptures de stock
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 col-span-2 lg:col-span-1 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 w-fit mx-auto mb-3 sm:mb-4">
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {formatAmount(valeurStock)} F
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Valeur du stock
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interface de gestion - Responsive */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardHeader>
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:items-center justify-between">
                <div>
                  <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Catalogue des Produits
                  </CardTitle>
                  <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Gérez vos produits et leurs stocks
                  </p>
                </div>
                
                <Dialog open={showModal} onOpenChange={setShowModal}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        resetForm()
                        setShowModal(true)
                      }}
                      className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Ajouter Produit</span>
                      <span className="sm:hidden">Ajouter</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className={`max-w-2xl ${
                    isDarkMode 
                      ? 'bg-slate-900/95 border-slate-700/50' 
                      : 'bg-white/95 border-slate-200/50'
                  } backdrop-blur-md`}>
                    <DialogHeader>
                      <DialogTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {editId ? 'Modifier le Produit' : 'Ajouter un Produit'}
                      </DialogTitle>
                    </DialogHeader>
                    
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                      {/* Upload d'image */}
                      <div className="space-y-2">
                        <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Image du produit
                        </Label>
                        <div className="relative">
                          <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          />
                          <div className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center transition-colors duration-300 ${
                            isDarkMode 
                              ? 'border-purple-600 hover:border-purple-500' 
                              : 'border-purple-300 hover:border-purple-500'
                          }`}>
                            <Upload className="h-8 w-8 sm:h-12 sm:w-12 text-purple-500 mx-auto mb-2 sm:mb-4" />
                            <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              {formData.image ? formData.image.name : "Cliquez pour ajouter une image"}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Nom du produit */}
                      <div className="space-y-2">
                        <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Nom du produit *
                        </Label>
                        <div className="relative">
                          <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                          <Input
                            name="nom"
                            value={formData.nom}
                            onChange={handleChange}
                            placeholder="Ex: iPhone 15 Pro"
                            className={`pl-10 ${
                              isDarkMode 
                                ? 'bg-slate-800/50 border-slate-600' 
                                : 'bg-white/50 border-slate-300'
                            }`}
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Prix unitaire */}
                        <div className="space-y-2">
                          <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Prix unitaire (FCFA) *
                          </Label>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                              name="prix_unitaire"
                              type="number"
                              value={formData.prix_unitaire}
                              onChange={handleChange}
                              placeholder="50000"
                              className={`pl-10 ${
                                isDarkMode 
                                  ? 'bg-slate-800/50 border-slate-600' 
                                  : 'bg-white/50 border-slate-300'
                              }`}
                              required
                            />
                          </div>
                        </div>

                        {/* Stock */}
                        <div className="space-y-2">
                          <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Stock initial *
                          </Label>
                          <div className="relative">
                            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                            <Input
                              name="stock"
                              type="number"
                              value={formData.stock}
                              onChange={handleChange}
                              placeholder="100"
                              className={`pl-10 ${
                                isDarkMode 
                                  ? 'bg-slate-800/50 border-slate-600' 
                                  : 'bg-white/50 border-slate-300'
                              }`}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Unité */}
                      <div className="space-y-2">
                        <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Unité *
                        </Label>
                        <Select value={formData.unite} onValueChange={(value) => setFormData({...formData, unite: value})}>
                          <SelectTrigger className={`${
                            isDarkMode 
                              ? 'bg-slate-800/50 border-slate-600' 
                              : 'bg-white/50 border-slate-300'
                          }`}>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-white/80 backdrop-blur-md text-gray-800 border border-gray-300 shadow-lg">
                            <SelectItem value="kg">Kilogramme</SelectItem>
                            <SelectItem value="litre">Litre</SelectItem>
                            <SelectItem value="unite">Unité</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Boutons d'action */}
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowModal(false)}
                          className="flex-1"
                          disabled={saving}
                        >
                          Annuler
                        </Button>
                        <Button
                          type="submit"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          disabled={saving}
                        >
                          {saving ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {editId ? 'Modification...' : 'Ajout...'}
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              {editId ? 'Modifier' : 'Ajouter'}
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Filtres - Responsive */}
              <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-4">
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
                <Select value={filterCategory} onValueChange={setFilterCategory}>
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

            <CardContent>
              {/* Desktop Table */}
              {!isMobile ? (
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Produit</TableHead>
                        <TableHead className="text-right">Prix Unitaire</TableHead>
                        <TableHead className="text-center">Stock</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-center">Unité</TableHead>
                        <TableHead className="text-center">Ajuster Stock</TableHead>
                        <TableHead className="text-center">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProduits.map((produit, index) => {
                        const stockStatus = getStockStatus(produit.stock)
                        
                        return (
                          <motion.tr
                            key={produit.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 rounded-lg overflow-hidden">
                                  <img
                                    src={produit.image ? `${PRODUCT_BASE_URL}/${produit.image}` : 'https://images.unsplash.com/photo-1586806829183-d1bf8382fb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG9wcGluZyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NzQ2NzcyOHww&ixlib=rb-4.1.0&q=80&w=1080'}
                                    alt={produit.nom}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <div className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-slate-800'
                                  }`}>
                                    {produit.nom}
                                  </div>
                                  {produit.categorie && (
                                    <Badge variant="outline" className="text-xs mt-1">
                                      {produit.categorie}
                                    </Badge>
                                  )}
                                  {produit.rating && (
                                    <div className="flex items-center space-x-1 mt-1">
                                      <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                      <span className={`text-xs ${
                                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                      }`}>
                                        {produit.rating}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <span className="font-semibold">
                                {formatAmount(produit.prix_unitaire)} FCFA
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <span className={`font-bold text-lg ${
                                produit.stock === 0 
                                  ? 'text-red-500' 
                                  : produit.stock <= 10 
                                    ? 'text-yellow-500' 
                                    : 'text-emerald-500'
                              }`}>
                                {produit.stock}
                              </span>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${stockStatus.color} text-white`}>
                                {stockStatus.text}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="outline">
                                {produit.unite}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  placeholder="Nouveau stock"
                                  className={`w-24 h-8 text-sm ${
                                    isDarkMode 
                                      ? 'bg-slate-800/50 border-slate-600' 
                                      : 'bg-white/50 border-slate-300'
                                  }`}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const input = e.target
                                      const newStock = parseInt(input.value)
                                      if (!isNaN(newStock)) {
                                        handleStockUpdate(produit.id, newStock)
                                        input.value = ''
                                      }
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={(e) => {
                                    const input = e.target.parentElement?.querySelector('input')
                                    const newStock = parseInt(input.value)
                                    if (!isNaN(newStock)) {
                                      handleStockUpdate(produit.id, newStock)
                                      input.value = ''
                                    }
                                  }}
                                  className="h-8 px-2"
                                >
                                  <CheckCircle className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleEdit(produit)}
                                  className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleDelete(produit.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        )
                      })}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                // Mobile Cards Layout
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  <AnimatePresence>
                    {filteredProduits.length > 0 ? (
                      filteredProduits.map((produit, index) => (
                        <ProduitCard key={produit.id} produit={produit} index={index} />
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex flex-col items-center space-y-4 py-12"
                      >
                        <div className={`rounded-full p-6 ${
                          isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                        }`}>
                          <Package className={`h-12 w-12 ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`} />
                        </div>
                        <div className="text-center">
                          <h3 className={`text-lg mb-2 ${
                            isDarkMode ? 'text-slate-300' : 'text-slate-700'
                          }`}>
                            Aucun produit trouvé
                          </h3>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-slate-400' : 'text-slate-500'
                          }`}>
                            {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez encore aucun produit'}
                          </p>
                        </div>
                        <Button 
                          onClick={() => {
                            resetForm()
                            setShowModal(true)
                          }}
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Ajouter un produit
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default ResponsiveGestionProduits