import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  Edit, 
  Trash2, 
  Download, 
  Upload, 
  Printer, 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Calendar, 
  ChevronDown, 
  UserCheck, 
  UserX, 
  Loader2,
  FileText,
  FileSpreadsheet,
  ArrowLeft,
  MoreHorizontal,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu'
import { ScrollArea } from '../../components/ui/scroll-area'
import { Separator } from '../../components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../../components/ui/collapsible'
import ApiService from '../../services/ApiService'
import ClientDetailModal from './ClientDetailModal'
import Swal from 'sweetalert2'
import { PRODUCT_BASE_URL } from '../../services/ApiService';


function GestionClient() {
  const [clients, setClients] = useState([])
  const [filteredClients, setFilteredClients] = useState([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatut, setFilterStatut] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  const clientsPerPage = 10

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  useEffect(() => {
    fetchClients()
  }, [])

  // Filtrage des clients
  useEffect(() => {
    let filtered = clients

    if (filterStatut) {
      filtered = filtered.filter(client => client.statut === filterStatut)
    }

    if (startDate) {
      filtered = filtered.filter(client => new Date(client.created_at) >= new Date(startDate))
    }
    if (endDate) {
      filtered = filtered.filter(client => new Date(client.created_at) <= new Date(endDate))
    }

    setFilteredClients(filtered)
    setCurrentPage(1) // Reset pagination when filters change
  }, [clients, filterStatut, startDate, endDate])

  // Recherche avec debounce
  useEffect(() => {
    if (searchTerm.trim() !== '') {
      const timer = setTimeout(() => {
        handleSearch()
      }, 400)
      return () => clearTimeout(timer)
    } else {
      setFilteredClients(clients)
    }
  }, [searchTerm, clients])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const response = await ApiService.getClients()
      if (Array.isArray(response.data)) {
        setClients(response.data)
        setFilteredClients(response.data)
      }
    } catch (err) {
      console.error('Erreur lors du chargement des clients', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger les clients'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients)
      return
    }

    try {
      const response = await ApiService.searchClients(searchTerm)
      if (Array.isArray(response.data)) {
        setFilteredClients(response.data)
      }
    } catch (error) {
      console.error('Erreur lors de la recherche de clients', error)
    }
  }

  const handleExport = async (format) => {
    setExporting(true)
    try {
      const response = await ApiService.exportClients(format)
      
      const url = URL.createObjectURL(response.data)
      const link = document.createElement('a')
      link.href = url
      link.download = `clients.${format}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      Swal.fire({
        icon: 'success',
        title: 'Export réussi',
        text: `Fichier ${format.toUpperCase()} téléchargé avec succès!`,
        timer: 2000,
        showConfirmButton: false
      })
    } catch (error) {
      console.error('Erreur export', error)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Erreur lors de l\'export'
      })
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = () => {
    const printContent = document.querySelector('.print-area')
    if (printContent) {
      const originalTitle = document.title
      document.title = 'Liste des clients'
      window.print()
      setTimeout(() => {
        document.title = originalTitle
      }, 1000)
    }
  }

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Êtes-vous sûr ?',
      text: 'Ce client sera définitivement supprimé.',
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
        await ApiService.deleteClient(id)
        await fetchClients()
        Swal.fire({
          icon: 'success',
          title: 'Supprimé !',
          text: 'Le client a été supprimé avec succès.',
          timer: 2000,
          showConfirmButton: false
        })
      } catch (error) {
        console.error('Erreur suppression client', error)
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'La suppression du client a échoué.'
        })
      }
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatutBadge = (statut) => {
    const isActif = statut.toLowerCase() === 'actif'
    return (
      <Badge className={`${
        isActif 
          ? 'bg-emerald-500 text-white' 
          : 'bg-red-500 text-white'
      }`}>
        {isActif ? (
          <UserCheck className="h-3 w-3 mr-1" />
        ) : (
          <UserX className="h-3 w-3 mr-1" />
        )}
        {statut}
      </Badge>
    )
  }

  // Pagination logic
  const totalPages = Math.ceil(filteredClients.length / clientsPerPage)
  const indexOfLastClient = currentPage * clientsPerPage
  const indexOfFirstClient = indexOfLastClient - clientsPerPage
  const currentClients = filteredClients.slice(indexOfFirstClient, indexOfLastClient)

  // Statistiques
  const totalClients = clients.length
  const clientsActifs = clients.filter(c => c.statut.toLowerCase() === 'actif').length
  const clientsInactifs = clients.filter(c => c.statut.toLowerCase() === 'inactif').length
  const clientsParticuliers = clients.filter(c => c.type.toLowerCase() === 'particulier').length
  const clientsEntreprises = clients.filter(c => c.type.toLowerCase() === 'entreprise').length

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
            Chargement des clients...
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
      <div className="container mx-auto p-6 space-y-8">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
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
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Gestion des Clients
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-purple-300' : 'text-indigo-600'
              }`}>
                Gérez votre base de clients
              </p>
            </div>
          </div>
        </motion.div>

        {/* Statistiques */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
        >
          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 w-fit mx-auto mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-cyan-500 bg-clip-text text-transparent">
                {totalClients}
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Total clients
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 w-fit mx-auto mb-4">
                <UserCheck className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {clientsActifs}
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Clients actifs
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 w-fit mx-auto mb-4">
                <UserX className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-red-500 to-pink-500 bg-clip-text text-transparent">
                {clientsInactifs}
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Clients inactifs
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-500 to-orange-500 w-fit mx-auto mb-4">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
                {clientsParticuliers}
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Particuliers
              </p>
            </CardContent>
          </Card>

          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md`}>
            <CardContent className="p-6 text-center">
              <div className="p-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 w-fit mx-auto mb-4">
                <Building className="h-8 w-8 text-white" />
              </div>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
                {clientsEntreprises}
              </div>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-400' : 'text-slate-600'
              }`}>
                Entreprises
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Interface de gestion */}
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
              <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                <div>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Liste des Clients
                  </CardTitle>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {filteredClients.length} client{filteredClients.length > 1 ? 's' : ''} trouvé{filteredClients.length > 1 ? 's' : ''}
                  </p>
                </div>
                
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    className={`${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-600' 
                        : 'bg-white/50 border-slate-300'
                    }`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nouveau Client
                  </Button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="outline"
                        disabled={exporting}
                        className={`${
                          isDarkMode 
                            ? 'bg-slate-800/50 border-slate-600' 
                            : 'bg-white/50 border-slate-300'
                        }`}
                      >
                        {exporting ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        Exporter
                        <ChevronDown className="h-3 w-3 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleExport('pdf')}>
                        <FileText className="h-4 w-4 mr-2" />
                        PDF
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport('csv')}>
                        <FileSpreadsheet className="h-4 w-4 mr-2" />
                        CSV
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button
                    variant="outline"
                    onClick={handlePrint}
                    className={`${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-600' 
                        : 'bg-white/50 border-slate-300'
                    }`}
                  >
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimer
                  </Button>

                  <Button
                    variant="outline"
                    className={`${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-600' 
                        : 'bg-white/50 border-slate-300'
                    }`}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Importer
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Filtres et recherche */}
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                  <div className="relative flex-1">
                    <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                      isDarkMode ? 'text-slate-400' : 'text-slate-500'
                    }`} />
                    <Input
                      placeholder="Rechercher par nom, prénom ou téléphone..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`pl-10 ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      }`}
                    />
                  </div>

                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className={`w-full md:w-48 ${
                      isDarkMode 
                        ? 'bg-slate-800/50 border-slate-600' 
                        : 'bg-white/50 border-slate-300'
                    }`}>
                      <Target className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>

                  <Collapsible open={showFilter} onOpenChange={setShowFilter}>
                    <CollapsibleTrigger asChild>
                      <Button 
                        variant="outline"
                        className={`${
                          isDarkMode 
                            ? 'bg-slate-800/50 border-slate-600' 
                            : 'bg-white/50 border-slate-300'
                        }`}
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filtrer par date
                        <ChevronDown className={`h-3 w-3 ml-2 transition-transform ${
                          showFilter ? 'rotate-180' : ''
                        }`} />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Date de début
                          </Label>
                          <Input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className={`${
                              isDarkMode 
                                ? 'bg-slate-800/50 border-slate-600' 
                                : 'bg-white/50 border-slate-300'
                            }`}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            Date de fin
                          </Label>
                          <Input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className={`${
                              isDarkMode 
                                ? 'bg-slate-800/50 border-slate-600' 
                                : 'bg-white/50 border-slate-300'
                            }`}
                          />
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="print-area">
                <ScrollArea className="h-[600px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead className="text-center">Type</TableHead>
                        <TableHead className="text-center">Statut</TableHead>
                        <TableHead className="text-center">Date d'ajout</TableHead>
                        <TableHead className="text-center print:hidden">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {currentClients.length > 0 ? (
                        currentClients.map((client, index) => (
                          <motion.tr
                            key={client.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-lg ${
                                  client.type.toLowerCase() === 'entreprise' 
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                                    : 'bg-gradient-to-r from-blue-500 to-cyan-500'
                                }`}>
                                  {client.type.toLowerCase() === 'entreprise' ? (
                                    <Building className="h-4 w-4 text-white" />
                                  ) : (
                                    <User className="h-4 w-4 text-white" />
                                  )}
                                </div>
                                <div>
                                  <div className={`font-medium ${
                                    isDarkMode ? 'text-white' : 'text-slate-800'
                                  }`}>
                                    {client.prenom} {client.nom}
                                  </div>
                                  <div className={`text-sm flex items-center space-x-1 ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                  }`}>
                                    <span>ID: {client.id}</span>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center space-x-2 text-sm">
                                  <Phone className="h-3 w-3 text-blue-500" />
                                  <span>{client.telephone}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <MapPin className="h-3 w-3 text-emerald-500" />
                                  <span className={`truncate max-w-48 ${
                                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                  }`}>
                                    {client.adresse}
                                  </span>
                                </div>
                              </div>
                            </TableCell>
                            
                            <TableCell className="text-center">
                              <Badge variant="outline" className={
                                client.type.toLowerCase() === 'entreprise' 
                                  ? 'border-purple-500 text-purple-600' 
                                  : 'border-blue-500 text-blue-600'
                              }>
                                {client.type}
                              </Badge>
                            </TableCell>
                            
                            <TableCell className="text-center">
                              {getStatutBadge(client.statut)}
                            </TableCell>
                            
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center space-x-1 text-sm">
                                <Calendar className={`h-3 w-3 ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                }`} />
                                <span>{formatDate(client.created_at)}</span>
                              </div>
                            </TableCell>
                            
                            <TableCell className="print:hidden">
                              <div className="flex items-center space-x-2">
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => setSelectedClientId(client.id)}
                                  className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                  <Eye className="h-3 w-3" />
                                </Button>
                                
                                <Button
                                  size="icon"
                                  variant="outline"
                                  className="h-8 w-8 text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                
                                <Button
                                  size="icon"
                                  variant="outline"
                                  onClick={() => handleDelete(client.id)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-12">
                            <div className="flex flex-col items-center space-y-3">
                              <div className={`p-4 rounded-full ${
                                isDarkMode ? 'bg-slate-800/50' : 'bg-slate-100'
                              }`}>
                                <Users className={`h-12 w-12 ${
                                  isDarkMode ? 'text-slate-600' : 'text-slate-400'
                                }`} />
                              </div>
                              <div>
                                <h3 className={`font-semibold ${
                                  isDarkMode ? 'text-white' : 'text-slate-800'
                                }`}>
                                  Aucun client trouvé
                                </h3>
                                <p className={`text-sm ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                  {searchTerm ? 'Aucun résultat pour votre recherche' : 'Vous n\'avez encore aucun client'}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </ScrollArea>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2 mt-6 print:hidden">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </Button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber
                        if (totalPages <= 5) {
                          pageNumber = i + 1
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i
                        } else {
                          pageNumber = currentPage - 2 + i
                        }

                        return (
                          <Button
                            key={pageNumber}
                            variant={currentPage === pageNumber ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className={currentPage === pageNumber ? 
                              "bg-gradient-to-r from-purple-600 to-pink-600 text-white" : 
                              ""
                            }
                          >
                            {pageNumber}
                          </Button>
                        )
                      })}
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Modal de détails client */}
      {selectedClientId && (
        <ClientDetailModal 
          clientId={selectedClientId} 
          onClose={() => setSelectedClientId(null)} 
        />
      )}
    </div>
  )
}

export default GestionClient