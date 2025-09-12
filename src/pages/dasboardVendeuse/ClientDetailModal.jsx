import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { 
  X, 
  User, 
  Phone, 
  MapPin, 
  Calendar, 
  ShoppingBag, 
  Package, 
  Loader2,
  CreditCard,
  TrendingUp,
  Hash,
  DollarSign,
  Clock,
  Badge as BadgeIcon
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { ScrollArea } from '../../components/ui/scroll-area'
import ApiService from '../../services/ApiService';
import Swal from 'sweetalert2'


function ClientDetailModal({ clientId, onClose }) {
  const [client, setClient] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  useEffect(() => {
    if (clientId) {
      fetchClient()
    }
  }, [clientId])

  const fetchClient = async () => {
    setLoading(true)
    try {
      const response = await ApiService.getClientDetail(clientId)
      setClient(response.data)
    } catch (error) {
      console.error('Erreur récupération client:', error)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les détails du client'
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Non défini"
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatAmount = (amount) => {
    if (amount == null || isNaN(amount)) {
      return "0 FCFA"
    }
    return Number(amount).toLocaleString('fr-FR') + ' FCFA'
  }

  const getStatutColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'actif': return 'bg-emerald-500'
      case 'inactif': return 'bg-red-500'
      case 'suspendu': return 'bg-yellow-500'
      default: return 'bg-slate-500'
    }
  }

  const totalVentes = client?.ventes?.reduce((sum, vente) => sum + (vente.montant_total || 0), 0) || 0
  const nombreVentes = client?.ventes?.length || 0

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
            Chargement des détails...
          </p>
        </motion.div>
      </div>
    )
  }

  if (!client) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-6xl max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700/50' 
              : 'bg-white/95 border-slate-200/50'
          } backdrop-blur-md shadow-2xl`}>
            
            {/* En-tête */}
            <CardHeader className="relative pb-6">
              <Button
                variant="outline"
                size="icon"
                onClick={onClose}
                className="absolute top-4 right-4 h-8 w-8 rounded-full border-slate-300 dark:border-slate-600"
              >
                <X className="h-4 w-4" />
              </Button>
              
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    <User className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {client.prenom} {client.nom}
                    </CardTitle>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge className={`${getStatutColor(client.statut)} text-white`}>
                        <BadgeIcon className="h-3 w-3 mr-1" />
                        {client.statut}
                      </Badge>
                      <span className={`text-sm ${
                        isDarkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Client {client.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Statistiques rapides */}
                <div className="flex space-x-4">
                  <div className={`text-center p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
                  }`}>
                    <div className="text-2xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      {nombreVentes}
                    </div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Ventes
                    </div>
                  </div>
                  <div className={`text-center p-3 rounded-lg ${
                    isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100/50'
                  }`}>
                    <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                      {formatAmount(totalVentes)}
                    </div>
                    <div className={`text-xs ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      Total
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-8">
                  
                  {/* Historique des ventes */}
                  {client.ventes?.length > 0 ? (
                    <div className="space-y-6">
                      {client.ventes.map((vente, index) => (
                        <motion.div
                          key={vente.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <Card className={`border-purple-500/20 ${
                            isDarkMode 
                              ? 'bg-slate-800/50 border-slate-700/50' 
                              : 'bg-white/80 border-slate-200/50'
                          }`}>
                            <CardHeader className="pb-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className="p-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500">
                                    <CreditCard className="h-5 w-5 text-white" />
                                  </div>
                                  <div>
                                    <h4 className={`font-semibold ${
                                      isDarkMode ? 'text-white' : 'text-slate-800'
                                    }`}>
                                      Vente #{vente.id}
                                    </h4>
                                    <div className="flex items-center space-x-2 text-sm">
                                      <Clock className={`h-3 w-3 ${
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
                                <div className="text-right">
                                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    {formatAmount(vente.montant_total)}
                                  </div>
                                  <div className={`text-sm ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                  }`}>
                                    Total
                                  </div>
                                </div>
                              </div>
                            </CardHeader>
                            
                            <CardContent>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Produit</TableHead>
                                      <TableHead className="text-center">Quantité</TableHead>
                                      <TableHead className="text-right">Prix unitaire</TableHead>
                                      <TableHead className="text-right">Montant total</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {vente.produits?.map((produit) => (
                                      <TableRow key={produit.id}>
                                        <TableCell>{produit.nom}</TableCell>
                                        <TableCell className="text-center">
                                          <Badge variant="outline">
                                            {produit.pivot?.quantite ?? 0}
                                          </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                          {formatAmount(produit.pivot?.prix_unitaire ?? 0)}
                                        </TableCell>
                                        <TableCell className="text-right font-semibold">
                                          {formatAmount(produit.pivot?.montant_total ?? 0)}
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <Card className={`${
                      isDarkMode 
                        ? 'bg-slate-800/30 border-slate-700/50' 
                        : 'bg-slate-50/50 border-slate-200/50'
                    }`}>
                      <CardContent className="p-8 text-center">
                        <ShoppingBag className={`h-16 w-16 mx-auto mb-4 ${
                          isDarkMode ? 'text-slate-600' : 'text-slate-400'
                        }`} />
                        <h4 className={`text-lg font-medium mb-2 ${
                          isDarkMode ? 'text-white' : 'text-slate-800'
                        }`}>
                          Aucune vente
                        </h4>
                        <p className={`${
                          isDarkMode ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          Ce client n'a encore effectué aucun achat
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </ScrollArea>

              {/* Bouton de fermeture */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 text-center"
              >
                <Button
                  onClick={onClose}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8"
                >
                  <X className="h-4 w-4 mr-2" />
                  Fermer
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default ClientDetailModal
