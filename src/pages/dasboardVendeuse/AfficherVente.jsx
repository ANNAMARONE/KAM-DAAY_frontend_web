import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  ArrowLeft, 
  Filter, 
  Plus, 
  Smile, 
  Frown, 
  User, 
  Calendar, 
  Package, 
  Hash, 
  DollarSign, 
  TrendingUp, 
  Trash2, 
  ThumbsUp, 
  ThumbsDown, 
  ChevronDown,
  ShoppingBag,
  Target,
  Loader2,
  Menu
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { ScrollArea } from '../../components/ui/scroll-area'
import { PRODUCT_BASE_URL } from '../../services/ApiService';
import Swal from 'sweetalert2'
import { PROFILE_BASE_URL } from '../../services/ApiService';
import ApiService from '../../services/ApiService';

function AfficherVente() {
  const [ventes, setVentes] = useState([])
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [openDropdownId, setOpenDropdownId] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  // Détection mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    setIsDarkMode(document.documentElement.classList.contains('dark'))
  }, [])

  useEffect(() => {
    fetchVentes()
  }, [])

  const fetchVentes = async () => {
    setLoading(true)
    try {
      const response = await ApiService.getMesVentes()
      setVentes(response.data.data)
    } catch (error) {
      console.error('Erreur lors du chargement des ventes:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les ventes'
      })
    } finally {
      setLoading(false)
    }
  }

  const noterFeedback = async (venteId, satisfait) => {
    try {
      const res = await ApiService.noterVente(venteId, satisfait)
      setVentes(prev =>
        prev.map(v =>
          v.id === venteId ? { ...v, feedback: res.data.data } : v
        )
      )
      setOpenDropdownId(null)
      Swal.fire({
        icon: 'success',
        title: 'Merci!',
        text: `Votre évaluation a été enregistrée.`,
        timer: 2000,
        showConfirmButton: false
      })
    } catch (err) {
      console.error('Erreur lors de la notation :', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: err?.response?.data?.message || 'Erreur lors de la notation.'
      })
    }
  }

  const supprimerVente = async (id) => {
    const confirmation = await Swal.fire({
      title: 'Supprimer cette vente ?',
      text: "Cette action est irréversible.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      background: isDarkMode ? '#1e293b' : '#ffffff',
      color: isDarkMode ? '#ffffff' : '#1e293b'
    })

    if (!confirmation.isConfirmed) return

    try {
      await ApiService.supprimerVente(id)
      setVentes(prev => prev.filter(v => v.id !== id))

      Swal.fire({
        icon: 'success',
        title: 'Vente supprimée',
        text: 'La vente a été supprimée avec succès.',
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Erreur suppression vente', error)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible de supprimer la vente."
      })
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount) => {
    return amount.toLocaleString('fr-FR') + ' FCFA'
  }

  const toggleDropdown = (id) => {
    setOpenDropdownId(prev => (prev === id ? null : id))
  }

  const totalVentes = ventes.length
  const totalMontant = ventes.reduce((sum, vente) => 
    sum + vente.produits.reduce((acc, p) => acc + p.pivot.montant_total, 0), 0
  )
  const ventesAvecFeedback = ventes.filter(v => v.feedback).length
  const satisfactionPositive = ventes.filter(v => v.feedback?.satisfait).length

  // Composant Card Vente pour mobile
  const VenteCard = ({ vente, index }) => {
    const totalMontantVente = vente.produits.reduce(
      (acc, p) => acc + p.pivot.montant_total, 0
    )

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.05 }}
        whileHover={{ scale: 1.01 }}
        className={`rounded-xl transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-800/60 border border-slate-600/30' 
            : 'bg-white/60 border border-slate-200/50'
        }`}
      >
        {/* En-tête de la vente */}
        <div className="p-4 border-b border-slate-600/30">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className={`font-semibold text-sm ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  {vente.client.prenom} {vente.client.nom}
                </h3>
                <div className="flex items-center space-x-1 text-xs">
                  <Calendar className={`h-3 w-3 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`} />
                  <span className={`${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {formatDate(vente.created_at)}
                  </span>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => supprimerVente(vente.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 p-1 h-auto"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>

          <div className="flex items-center justify-between">
            {/* Total de la vente */}
            <div>
              <div className="text-lg font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {formatAmount(totalMontantVente)}
              </div>
              <div className={`text-xs ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total vente
              </div>
            </div>

            {/* Satisfaction */}
            <div className="text-center">
              {vente.feedback ? (
                <div className="flex items-center space-x-2">
                  {vente.feedback.satisfait ? (
                    <>
                      <Smile className="h-5 w-5 text-emerald-500" />
                      <Badge className="bg-emerald-500 text-white text-xs">
                        Satisfait
                      </Badge>
                    </>
                  ) : (
                    <>
                      <Frown className="h-5 w-5 text-red-500" />
                      <Badge className="bg-red-500 text-white text-xs">
                        Non satisfait
                      </Badge>
                    </>
                  )}
                </div>
              ) : (
                <DropdownMenu 
                  open={openDropdownId === vente.id}
                  onOpenChange={() => toggleDropdown(vente.id)}
                >
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className={`text-xs ${
                        isDarkMode 
                          ? 'bg-slate-700/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      }`}
                    >
                      <Target className="h-3 w-3 mr-1" />
                      Noter
                      <ChevronDown className="h-2 w-2 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem 
                      onClick={() => noterFeedback(vente.id, 1)}
                      className="cursor-pointer"
                    >
                      <ThumbsUp className="h-4 w-4 mr-2 text-emerald-500" />
                      Satisfait
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => noterFeedback(vente.id, 0)}
                      className="cursor-pointer"
                    >
                      <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                      Non satisfait
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>

        {/* Produits de la vente */}
        <div className="p-4">
          <div className="space-y-3">
            {vente.produits.map((produit) => (
              <div key={produit.id} className={`p-3 rounded-lg ${
                isDarkMode ? 'bg-slate-700/30' : 'bg-slate-50'
              }`}>
                <div className="flex items-center space-x-3 mb-2">
                  <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={produit.image ? `${PRODUCT_BASE_URL}/${produit.image}` : 'https://images.unsplash.com/photo-1586806829183-d1bf8382fb03?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBzaG9wcGluZyUyMHByb2R1Y3RzfGVufDF8fHx8MTc1NzQ2NzcyOHww&ixlib=rb-4.1.0&q=80&w=1080'}
                      alt={produit.nom}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-medium text-sm truncate ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {produit.nom}
                    </div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      par {produit.unite}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      {produit.pivot.quantite} {produit.unite}
                    </Badge>
                    <div className={`mt-1 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Quantité
                    </div>
                  </div>
                  <div className="text-center">
                    <div className={`font-medium ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      {formatAmount(produit.pivot.prix_unitaire)}
                    </div>
                    <div className={`${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Prix unit.
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-emerald-600">
                      {formatAmount(produit.pivot.montant_total)}
                    </div>
                    <div className={`${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Total
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
            Chargement des ventes...
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
          className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0"
        >
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => window.history.back()}
              className={`${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-600 hover:bg-slate-700/50' 
                  : 'bg-white/50 border-slate-300 hover:bg-white'
              }`}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Mes Ventes
              </h1>
              <p className={`text-sm sm:text-base lg:text-lg ${
                isDarkMode ? 'text-purple-300' : 'text-indigo-600'
              }`}>
                Historique et suivi de vos transactions
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              className={`w-full sm:w-auto ${
                isDarkMode 
                  ? 'bg-slate-800/50 border-slate-600' 
                  : 'bg-white/50 border-slate-300'
              }`}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtrer
            </Button>
            <Button 
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nouvelle Vente
            </Button>
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
                <ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {totalVentes}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total des ventes
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
                <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {formatAmount(totalMontant)}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Chiffre d'affaires
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
                <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {ventesAvecFeedback}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Ventes évaluées
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 col-span-2 lg:col-span-1 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="p-2 sm:p-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-500 w-fit mx-auto mb-3 sm:mb-4">
                <Smile className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
                {satisfactionPositive}
              </div>
              <p className={`text-xs sm:text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Clients satisfaits
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Affichage des ventes - Responsive */}
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
              <CardTitle className="text-xl sm:text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Historique détaillé
              </CardTitle>
              <p className={`text-sm sm:text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Liste complète de vos ventes avec détails
              </p>
            </CardHeader>
            
            <CardContent>
              {ventes.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`p-4 rounded-full mx-auto w-fit mb-4 ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'
                  }`}>
                    <ShoppingBag className={`h-16 w-16 ${
                      isDarkMode ? 'text-slate-600' : 'text-slate-400'
                    }`} />
                  </div>
                  <h3 className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-slate-800'
                  }`}>
                    Aucune vente
                  </h3>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Vous n'avez encore effectué aucune vente
                  </p>
                </div>
              ) : (
                <>
                  {/* Desktop Table */}
                  {!isMobile ? (
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-6">
                        {ventes.map((vente, venteIndex) => {
                          const totalMontantVente = vente.produits.reduce(
                            (acc, p) => acc + p.pivot.montant_total, 0
                          )

                          return (
                            <motion.div
                              key={vente.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 * venteIndex }}
                            >
                              <Card className={`border-purple-500/10 ${
                                isDarkMode 
                                  ? 'bg-slate-800/50 border-slate-700/30' 
                                  : 'bg-slate-50/50 border-slate-200/30'
                              }`}>
                                {/* En-tête de la vente */}
                                <CardHeader className="pb-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                      <div className="p-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600">
                                        <User className="h-5 w-5 text-white" />
                                      </div>
                                      <div>
                                        <h3 className={`font-semibold ${
                                          isDarkMode ? 'text-white' : 'text-slate-800'
                                        }`}>
                                          {vente.client.prenom} {vente.client.nom}
                                        </h3>
                                        <div className="flex items-center space-x-2 text-sm">
                                          <Calendar className={`h-3 w-3 ${
                                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                          }`} />
                                          <span className={`${
                                            isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                          }`}>
                                            {formatDate(vente.created_at)}
                                          </span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center space-x-4">
                                      {/* Total de la vente */}
                                      <div className="text-right">
                                        <div className="text-xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                                          {formatAmount(totalMontantVente)}
                                        </div>
                                        <div className={`text-sm ${
                                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                        }`}>
                                          Total vente
                                        </div>
                                      </div>

                                      {/* Satisfaction */}
                                      <div className="text-center">
                                        {vente.feedback ? (
                                          <div className="flex items-center space-x-2">
                                            {vente.feedback.satisfait ? (
                                              <>
                                                <Smile className="h-6 w-6 text-emerald-500" />
                                                <Badge className="bg-emerald-500 text-white">
                                                  Satisfait
                                                </Badge>
                                              </>
                                            ) : (
                                              <>
                                                <Frown className="h-6 w-6 text-red-500" />
                                                <Badge className="bg-red-500 text-white">
                                                  Non satisfait
                                                </Badge>
                                              </>
                                            )}
                                          </div>
                                        ) : (
                                          <DropdownMenu 
                                            open={openDropdownId === vente.id}
                                            onOpenChange={() => toggleDropdown(vente.id)}
                                          >
                                            <DropdownMenuTrigger asChild>
                                              <Button 
                                                variant="outline" 
                                                size="sm"
                                                className={`${
                                                  isDarkMode 
                                                    ? 'bg-slate-700/50 border-slate-600' 
                                                    : 'bg-white/50 border-slate-300'
                                                }`}
                                              >
                                                <Target className="h-4 w-4 mr-2" />
                                                Noter
                                                <ChevronDown className="h-3 w-3 ml-2" />
                                              </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent>
                                              <DropdownMenuItem 
                                                onClick={() => noterFeedback(vente.id, 1)}
                                                className="cursor-pointer"
                                              >
                                                <ThumbsUp className="h-4 w-4 mr-2 text-emerald-500" />
                                                Satisfait
                                              </DropdownMenuItem>
                                              <DropdownMenuItem 
                                                onClick={() => noterFeedback(vente.id, 0)}
                                                className="cursor-pointer"
                                              >
                                                <ThumbsDown className="h-4 w-4 mr-2 text-red-500" />
                                                Non satisfait
                                              </DropdownMenuItem>
                                            </DropdownMenuContent>
                                          </DropdownMenu>
                                        )}
                                      </div>

                                      {/* Actions */}
                                      <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => supprimerVente(vente.id)}
                                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                </CardHeader>

                                {/* Produits de la vente */}
                                <CardContent>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead className="flex items-center space-x-2">
                                          <Package className="h-4 w-4" />
                                          <span>Produit</span>
                                        </TableHead>
                                        <TableHead className="text-center">
                                          <div className="flex items-center justify-center space-x-2">
                                            <Hash className="h-4 w-4" />
                                            <span>Quantité</span>
                                          </div>
                                        </TableHead>
                                        <TableHead className="text-right">
                                          <div className="flex items-center justify-end space-x-2">
                                            <DollarSign className="h-4 w-4" />
                                            <span>Prix unitaire</span>
                                          </div>
                                        </TableHead>
                                        <TableHead className="text-right">
                                          <div className="flex items-center justify-end space-x-2">
                                            <TrendingUp className="h-4 w-4" />
                                            <span>Total</span>
                                          </div>
                                        </TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {vente.produits.map((produit) => (
                                        <TableRow key={produit.id}>
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
                                                <div className={`text-sm ${
                                                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                                }`}>
                                                  par {produit.unite}
                                                </div>
                                              </div>
                                            </div>
                                          </TableCell>
                                          <TableCell className="text-center">
                                            <Badge variant="outline">
                                              {produit.pivot.quantite} {produit.unite}
                                            </Badge>
                                          </TableCell>
                                          <TableCell className="text-right">
                                            {formatAmount(produit.pivot.prix_unitaire)}
                                          </TableCell>
                                          <TableCell className="text-right font-semibold">
                                            {formatAmount(produit.pivot.montant_total)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </CardContent>
                              </Card>
                            </motion.div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  ) : (
                    // Mobile Cards Layout
                    <div className="space-y-4 max-h-[600px] overflow-y-auto">
                      <AnimatePresence>
                        {ventes.map((vente, index) => (
                          <VenteCard key={vente.id} vente={vente} index={index} />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}

export default AfficherVente