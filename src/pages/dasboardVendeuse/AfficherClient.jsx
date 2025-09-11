import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Filter, 
  UserPlus, 
  FileDown, 
  Printer, 
  Eye, 
  MessageCircle,
  Users,
  Calendar,
  Phone,
  MapPin,
  Building,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  MoreVertical,
  Sun,
  Moon,
  Sparkles,
  Zap
} from 'lucide-react';
import ApiService from '../../services/ApiService';
import ClientDetailModal from './ClientDetailModal';

// Import des composants shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip";

function AfficherClient() {
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
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const clientsPerPage = 8;

  const navigate = useNavigate();

  // Gestion du thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'light');
    }
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
  }, []);

  // Sécurisation pour éviter les erreurs .slice
  const safeFilteredClients = Array.isArray(filteredClients) ? filteredClients : [];
  const totalPages = Math.ceil(safeFilteredClients.length / clientsPerPage);
  const indexOfLastClient = currentPage * clientsPerPage;
  const indexOfFirstClient = indexOfLastClient - clientsPerPage;
  const currentClients = safeFilteredClients.slice(indexOfFirstClient, indexOfLastClient);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setIsLoading(true);
        const response = await ApiService.getClients();
        const data = Array.isArray(response.data) ? response.data : [];
        setClients(data);
        setFilteredClients(data);
        console.log("Données reçues de l'API :", response.data);
      } catch (err) {
        console.error('Erreur lors du chargement des clients:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClients();
  }, []);

  useEffect(() => {
    let filtered = clients;

    if (filterStatut) {
      filtered = filtered.filter(client => client.statut === filterStatut);
    }

    if (startDate) {
      filtered = filtered.filter(client => new Date(client.created_at) >= new Date(startDate));
    }

    if (endDate) {
      filtered = filtered.filter(client => new Date(client.created_at) <= new Date(endDate));
    }

    setFilteredClients(filtered);
  }, [clients, filterStatut, startDate, endDate]);

  const handleToggleFilter = () => setShowFilter(!showFilter);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      setFilteredClients(clients);
      return;
    }

    try {
      const response = await ApiService.searchClients(searchTerm);
      const data = Array.isArray(response.data) ? response.data : [];
      setFilteredClients(data);
    } catch (error) {
      console.error('Erreur lors de la recherche de clients:', error);
      setFilteredClients([]);
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
      console.error('Erreur export:', error);
    }
  };

  const handlePrint = () => {
    const previousTitle = document.title;
    document.title = 'Liste_des_clients';
    window.print();
    setTimeout(() => {
      document.title = previousTitle;
    }, 1000);
  };

  const handleWhatsappClick = (clientId) => {
    ApiService.startWhatsAppConversationClient(clientId)
      .then(res => {
        if (res.data?.whatsapp_link) {
          window.open(res.data.whatsapp_link, '_blank');
        }
      })
      .catch(err => {
        console.error("Erreur WhatsApp:", err);
      });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatut('');
    setStartDate('');
    setEndDate('');
    setFilteredClients(clients);
    setShowFilter(false);
  };

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center h-screen transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
          : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
      }`}>
        <motion.div 
          className="flex flex-col items-center space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-purple-200 border-t-purple-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className={`text-xl ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Chargement des clients...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="p-8 space-y-8">
        {/* Header */}
        <motion.div 
          className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center space-x-6">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => navigate(-1)}
                className={`rounded-xl transition-all duration-300 ${
                  isDarkMode 
                    ? 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300' 
                    : 'border-slate-300 bg-white/50 hover:bg-slate-100/50 text-slate-600'
                }`}
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </motion.div>
            <div className="space-y-2">
              <motion.h1 
                className={`text-5xl tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                Mes Clients
              </motion.h1>
              <motion.p 
                className={`text-lg ${isDarkMode ? 'text-purple-200' : 'text-indigo-600'}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                Gérez votre portefeuille client avec style
              </motion.p>
            </div>
          </div>

          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              variant="outline" 
              onClick={() => navigate('/ventes')}
              className={`rounded-xl transition-all duration-300 hover:scale-105 ${
                isDarkMode 
                  ? 'border-purple-500 bg-slate-800/50 text-purple-300 hover:bg-purple-500/20' 
                  : 'border-purple-500 bg-white/50 text-purple-600 hover:bg-purple-50'
              }`}
            >
              <UserPlus className="mr-2 h-5 w-5" />
              Ajouter Client
            </Button>
          </motion.div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className={`transition-all duration-300 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-500/30 backdrop-blur-sm hover:shadow-blue-500/25' 
                : 'bg-gradient-to-br from-blue-100/80 to-blue-50/60 border-blue-200/50 backdrop-blur-sm hover:shadow-blue-500/15'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm ${isDarkMode ? 'text-blue-100' : 'text-blue-700'}`}>
                  Total Clients
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className={`h-6 w-6 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className={`text-3xl ${isDarkMode ? 'text-white' : 'text-blue-900'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {safeFilteredClients.length}
                </motion.div>
                <div className={`flex items-center text-sm ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">+12%</span>
                  <span className="ml-1">ce mois</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className={`transition-all duration-300 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-green-900/80 to-green-800/60 border-green-500/30 backdrop-blur-sm hover:shadow-green-500/25' 
                : 'bg-gradient-to-br from-green-100/80 to-green-50/60 border-green-200/50 backdrop-blur-sm hover:shadow-green-500/15'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm ${isDarkMode ? 'text-green-100' : 'text-green-700'}`}>
                  Clients Actifs
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <CheckCircle className={`h-6 w-6 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className={`text-3xl ${isDarkMode ? 'text-white' : 'text-green-900'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {safeFilteredClients.filter(c => c.statut === 'actif').length}
                </motion.div>
                <div className={`flex items-center text-sm ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                  <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                  <span>Statut actif</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className={`transition-all duration-300 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-purple-900/80 to-purple-800/60 border-purple-500/30 backdrop-blur-sm hover:shadow-purple-500/25' 
                : 'bg-gradient-to-br from-purple-100/80 to-purple-50/60 border-purple-200/50 backdrop-blur-sm hover:shadow-purple-500/15'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm ${isDarkMode ? 'text-purple-100' : 'text-purple-700'}`}>
                  Entreprises
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Building className={`h-6 w-6 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className={`text-3xl ${isDarkMode ? 'text-white' : 'text-purple-900'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {safeFilteredClients.filter(c => c.type === 'Entreprise').length}
                </motion.div>
                <div className={`flex items-center text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                  <Building className="h-4 w-4 text-purple-500 mr-1" />
                  <span>Clients B2B</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className={`transition-all duration-300 hover:shadow-2xl ${
              isDarkMode 
                ? 'bg-gradient-to-br from-orange-900/80 to-orange-800/60 border-orange-500/30 backdrop-blur-sm hover:shadow-orange-500/25' 
                : 'bg-gradient-to-br from-orange-100/80 to-orange-50/60 border-orange-200/50 backdrop-blur-sm hover:shadow-orange-500/15'
            }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className={`text-sm ${isDarkMode ? 'text-orange-100' : 'text-orange-700'}`}>
                  Ajoutés ce mois
                </CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Calendar className={`h-6 w-6 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`} />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className={`text-3xl ${isDarkMode ? 'text-white' : 'text-orange-900'}`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {safeFilteredClients.filter(c => {
                    const clientDate = new Date(c.created_at);
                    const currentDate = new Date();
                    return clientDate.getMonth() === currentDate.getMonth() && 
                           clientDate.getFullYear() === currentDate.getFullYear();
                  }).length}
                </motion.div>
                <div className={`flex items-center text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-600'}`}>
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500">Nouveau</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className={`transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-800/60 border-slate-600/30 backdrop-blur-sm' 
              : 'bg-white/60 border-slate-200/50 backdrop-blur-sm'
          }`}>
            <CardHeader className="pb-4">
              <div className="flex flex-col space-y-4 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                  <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-500'
                  }`} />
                  <Input
                    type="text"
                    placeholder="Rechercher un client..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`pl-10 pr-10 rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white placeholder-slate-400 focus:ring-purple-500' 
                        : 'bg-white/50 border-slate-300 text-slate-800 placeholder-slate-500 focus:ring-purple-500'
                    }`}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-transparent"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Filter Controls */}
                <div className="flex items-center space-x-4">
                  <Select value={filterStatut} onValueChange={setFilterStatut}>
                    <SelectTrigger className={`w-[180px] rounded-xl ${
                      isDarkMode 
                        ? 'bg-slate-700/50 border-slate-600 text-white' 
                        : 'bg-white/50 border-slate-300 text-slate-800'
                    }`}>
                      <SelectValue placeholder="Statut" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tous">Tous les statuts</SelectItem>
                      <SelectItem value="actif">Actif</SelectItem>
                      <SelectItem value="inactif">Inactif</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    onClick={handleToggleFilter}
                    className={`rounded-xl transition-all duration-300 ${
                      isDarkMode 
                        ? 'border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600' 
                        : 'border-slate-300 bg-white/50 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrer par date
                  </Button>

                  {/* Export and Print */}
                  <div className="flex items-center space-x-2">
                    <DropdownMenu open={showExportOptions} onOpenChange={setShowExportOptions}>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="outline"
                          className={`rounded-xl transition-all duration-300 ${
                            isDarkMode 
                              ? 'border-green-600 bg-green-900/20 text-green-300 hover:bg-green-800/30' 
                              : 'border-green-600 bg-green-50 text-green-700 hover:bg-green-100'
                          }`}
                        >
                          <FileDown className="mr-2 h-4 w-4" />
                          Exporter
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem onClick={() => handleExport('pdf')}>
                          📄 Export PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleExport('csv')}>
                          📊 Export CSV
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <Button 
                      variant="outline"
                      onClick={handlePrint}
                      className={`rounded-xl transition-all duration-300 ${
                        isDarkMode 
                          ? 'border-blue-600 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30' 
                          : 'border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Imprimer
                    </Button>
                  </div>
                </div>
              </div>

              {/* Date Filter Expansion */}
              <AnimatePresence>
                {showFilter && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4 pt-4 border-t border-slate-600/30"
                  >
                    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
                      <div className="flex items-center space-x-2">
                        <label className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Du:
                        </label>
                        <Input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className={`rounded-xl ${
                            isDarkMode 
                              ? 'bg-slate-700/50 border-slate-600 text-white' 
                              : 'bg-white/50 border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <label className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                          Au:
                        </label>
                        <Input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className={`rounded-xl ${
                            isDarkMode 
                              ? 'bg-slate-700/50 border-slate-600 text-white' 
                              : 'bg-white/50 border-slate-300 text-slate-800'
                          }`}
                        />
                      </div>
                      <Button
                        onClick={() => setShowFilter(false)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                      >
                        Appliquer
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardHeader>
          </Card>
        </motion.div>

        {/* Clients Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className={`transition-all duration-300 ${
            isDarkMode 
              ? 'bg-slate-800/60 border-slate-600/30 backdrop-blur-sm' 
              : 'bg-white/60 border-slate-200/50 backdrop-blur-sm'
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className={`text-2xl flex items-center ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                  <Users className="mr-3 h-7 w-7 text-blue-500" />
                  Liste des Clients
                </CardTitle>
                <Badge variant="secondary" className={`text-lg px-4 py-2 ${
                  isDarkMode 
                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
                    : 'bg-purple-100 text-purple-700 border-purple-300'
                }`}>
                  {safeFilteredClients.length} clients
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-xl overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className={`${isDarkMode ? 'border-slate-600/50' : 'border-slate-200/50'}`}>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Client</TableHead>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Contact</TableHead>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Type</TableHead>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Adresse</TableHead>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Statut</TableHead>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Date</TableHead>
                      <TableHead className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {currentClients.length > 0 ? (
                        currentClients.map((client, index) => (
                          <motion.tr 
                            key={client.id}
                            className={`transition-colors hover:scale-[1.01] ${
                              isDarkMode 
                                ? 'border-slate-600/30 hover:bg-slate-700/30' 
                                : 'border-slate-200/30 hover:bg-slate-50/50'
                            }`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                            whileHover={{ scale: 1.01 }}
                          >
                            <TableCell>
                              <div className="flex items-center space-x-4">
                                <motion.div
                                  whileHover={{ scale: 1.1 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Avatar className="h-12 w-12 border-2 border-purple-500/30">
                                    <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-lg">
                                      {client.nom?.charAt(0)}{client.prenom?.charAt(0)}
                                    </AvatarFallback>
                                  </Avatar>
                                </motion.div>
                                <div>
                                  <p className={`leading-none mb-1 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    {client.nom} {client.prenom}
                                  </p>
                                  <Badge variant="outline" className={`text-xs ${
                                    isDarkMode 
                                      ? 'border-slate-500 text-slate-400' 
                                      : 'border-slate-300 text-slate-600'
                                  }`}>
                                    ID: {client.id}
                                  </Badge>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className={`flex items-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                  <Phone className="h-4 w-4 mr-2 text-green-500" />
                                  {client.telephone}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={client.type === 'Entreprise' ? 'default' : 'secondary'}
                                className={`px-3 py-1 ${
                                  client.type === 'Entreprise' 
                                    ? isDarkMode 
                                      ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
                                      : 'bg-purple-100 text-purple-700 border-purple-300'
                                    : isDarkMode 
                                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' 
                                      : 'bg-blue-100 text-blue-700 border-blue-300'
                                }`}
                              >
                                {client.type === 'Entreprise' ? (
                                  <Building className="h-3 w-3 mr-1" />
                                ) : (
                                  <Users className="h-3 w-3 mr-1" />
                                )}
                                {client.type}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className={`flex items-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <MapPin className="h-4 w-4 mr-2 text-red-500" />
                                <span className="truncate max-w-[150px]">
                                  {client.adresse || 'Non renseignée'}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <motion.div
                                whileHover={{ scale: 1.05 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Badge 
                                  variant={client.statut === 'actif' ? 'default' : 'destructive'}
                                  className={`px-3 py-1 flex items-center w-fit ${
                                    client.statut === 'actif' 
                                      ? 'bg-green-600/20 text-green-300 border-green-500/30' 
                                      : 'bg-red-600/20 text-red-300 border-red-500/30'
                                  }`}
                                >
                                  <motion.div 
                                    className={`w-2 h-2 rounded-full mr-2 ${
                                      client.statut === 'actif' ? 'bg-green-400' : 'bg-red-400'
                                    }`}
                                    animate={{ 
                                      scale: client.statut === 'actif' ? [1, 1.2, 1] : 1,
                                      opacity: client.statut === 'actif' ? [1, 0.7, 1] : 1
                                    }}
                                    transition={{ 
                                      duration: 2, 
                                      repeat: client.statut === 'actif' ? Infinity : 0 
                                    }}
                                  />
                                  {client.statut}
                                </Badge>
                              </motion.div>
                            </TableCell>
                            <TableCell className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              {new Date(client.created_at).toLocaleDateString('fr-FR')}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => setSelectedClientId(client.id)}
                                          className={`rounded-lg p-2 ${
                                            isDarkMode 
                                              ? 'border-blue-600 bg-blue-900/20 text-blue-300 hover:bg-blue-800/30' 
                                              : 'border-blue-600 bg-blue-50 text-blue-700 hover:bg-blue-100'
                                          }`}
                                        >
                                          <Eye className="h-4 w-4" />
                                        </Button>
                                      </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Voir les détails</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>

                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <motion.div
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Button 
                                          variant="outline" 
                                          size="sm"
                                          onClick={() => handleWhatsappClick(client.id)}
                                          className="rounded-lg p-2 bg-green-600/20 text-green-300 border-green-500/30 hover:bg-green-500/30"
                                        >
                                          <MessageCircle className="h-4 w-4" />
                                        </Button>
                                      </motion.div>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                      <p>Contacter via WhatsApp</p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              </div>
                            </TableCell>
                          </motion.tr>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan="7" className="text-center py-12">
                            <motion.div
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.6 }}
                              className="flex flex-col items-center space-y-4"
                            >
                              <div className={`rounded-full p-6 ${
                                isDarkMode ? 'bg-slate-700/50' : 'bg-slate-100/50'
                              }`}>
                                <Users className={`h-12 w-12 ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`} />
                              </div>
                              <div className="text-center">
                                <h3 className={`text-lg mb-2 ${
                                  isDarkMode ? 'text-slate-300' : 'text-slate-700'
                                }`}>
                                  Aucun client trouvé
                                </h3>
                                <p className={`text-sm ${
                                  isDarkMode ? 'text-slate-400' : 'text-slate-500'
                                }`}>
                                  Ajustez vos critères de recherche ou ajoutez de nouveaux clients
                                </p>
                              </div>
                              <Button 
                                onClick={() => navigate('/ventes')}
                                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-xl"
                              >
                                <UserPlus className="mr-2 h-4 w-4" />
                                Ajouter un client
                              </Button>
                            </motion.div>
                          </TableCell>
                        </TableRow>
                      )}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div 
                  className="flex items-center justify-center space-x-2 mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <motion.div
                      key={page}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-lg ${
                          page === currentPage 
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white' 
                            : isDarkMode 
                              ? 'border-slate-600 bg-slate-700/50 text-slate-300 hover:bg-slate-600' 
                              : 'border-slate-300 bg-white/50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {page}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Client Detail Modal */}
        <AnimatePresence>
          {selectedClientId && (
            <ClientDetailModal 
              clientId={selectedClientId} 
              onClose={() => setSelectedClientId(null)} 
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AfficherClient;