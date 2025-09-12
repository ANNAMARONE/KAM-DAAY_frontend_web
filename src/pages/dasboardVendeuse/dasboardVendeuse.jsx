import React, { useState, useEffect } from 'react';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Smile, 
  Eye, 
  Frown, 
  UserPlus,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  BarChart3,
  Clock,
  Star,
  Zap,
  Target,
  Sun,
  Moon
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { useNavigate } from "react-router-dom";

// Import du hook pour le thème
import { useTheme } from '/hooks/useTheme';

import ApiService from '../../services/ApiService';

// Import des composants shadcn/ui
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Progress } from "../../components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Separator } from "../../components/ui/separator";



export default function DashboardVendeuse() {
  // Hook pour le thème global
  const { isDarkMode, toggleTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const [activitesRecentes, setActivitesRecentes] = useState([]);
  const [clients, setClients] = useState([]);
  const [nombreClients, setNombreClients] = useState(0);
  const [ventesAujourdhui, setVentesAujourdhui] = useState(0);
  const [revenusDuMois, setRevenusDuMois] = useState(0);
  const [tauxSatisfaction, setTauxSatisfaction] = useState(0);
  const [ventesParMois, setVentesParMois] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [clientsRecent, setClientsRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  // Fonction de navigation simulée
  const handleNavigation = (route) => {
    console.log(`Navigation vers: ${route}`);
    alert(`Redirection vers: ${route}`);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Charger les clients
        const clientsResponse = await ApiService.getClients();
        setClients(clientsResponse.data);

        const activitesRecentes = await ApiService. getRecentActions();
        setActivitesRecentes(activitesRecentes.data);
       
        //charger les client plus recente
        const clientRecent = await ApiService.GetClientResente();
        setClientsRecent(clientRecent.data)
        
        // Charger les statistiques globales
        const statsRes = await ApiService.getStatistiques();
        setNombreClients(statsRes.data.nombre_clients);
        setVentesAujourdhui(statsRes.data.ventes_aujourdhui);
        setRevenusDuMois(statsRes.data.revenus_du_mois);
        setTauxSatisfaction(statsRes.data.taux_satisfaction);
        setVentesParMois(statsRes.data.ventes_par_mois);

        // Charger feedbacks récents
        const feedbacksRes = await ApiService.getFeedbacks();
        setFeedbacks(feedbacksRes.data);

      } catch (err) {
        console.error('Erreur lors du chargement des données du tableau de bord', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className={themeClasses.page}>
        <motion.div 
          className="flex flex-col items-center justify-center h-screen space-y-4"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="animate-spin rounded-full h-16 w-16 border-4 border-primary/20 border-t-primary"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
          <motion.p 
            className="text-headline text-theme-secondary"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Chargement du tableau de bord...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Préparer labels et données pour les 6 derniers mois
  const moisLabels = [];
  const moisNombres = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    moisLabels.push(date.toLocaleString('fr-FR', { month: 'short' }));
    const key = (date.getMonth() + 1).toString();
    moisNombres.push(Number(ventesParMois[key]) || 0);
  }

  const ventesData = moisLabels.map((mois, index) => ({
    mois: mois,
    ventes: moisNombres[index],
    commandes: Math.floor(moisNombres[index] / 50000)
  }));

  return (
    <div className={themeClasses.page}>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6 sm:space-y-8 lg:space-y-10">
        {/* En-tête avec toggle thème */}
        <motion.div 
          className="flex flex-col space-y-4 sm:space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-2 sm:space-y-3">
            <motion.h1 
              className="text-3xl sm:text-4xl lg:text-display bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Tableau de Bord
            </motion.h1>
            <motion.p 
              className="text-body sm:text-subtitle text-theme-secondary"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Bienvenue sur votre dashboard de vente moderne
            </motion.p>
          </div>
          <motion.div 
            className="flex flex-wrap gap-2 sm:gap-4 sm:space-x-0"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {/* Toggle du thème */}
            
            
            <Button 
              variant="outline" 
              className={`${themeClasses.card} border-primary/30 text-theme-primary hover:bg-primary/10 px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base`}
              onClick={() => navigate('/rapports')}
            >
              <BarChart3 className="mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Rapports</span>
              <span className="sm:hidden">Stats</span>
            </Button>
            <Button 
              className={`${themeClasses.button} px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base`}
              onClick={() => navigate('/ventes')}
            >
              <UserPlus className="mr-2 h-4 w-4 sm:mr-3 sm:h-5 sm:w-5" />
              <span className="hidden sm:inline">Ajouter un client</span>
              <span className="sm:hidden">+ Client</span>
            </Button>
          </motion.div>
        </motion.div>

        {/* Cartes de statistiques principales */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <Card className={`${themeClasses.card} hover:${themeClasses.shadow.lg} transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-body sm:text-subtitle text-theme-primary">Total Clients</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-2xl sm:text-3xl lg:text-headline text-theme-primary mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  {nombreClients}
                </motion.div>
                <div className="flex items-center text-caption sm:text-body text-theme-secondary">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                  <span className="text-green-500">+12% ce mois</span>
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
            <Card className={`${themeClasses.card} hover:${themeClasses.shadow.lg} transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-body sm:text-subtitle text-theme-primary">Ventes Aujourd'hui</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingCart className="h-6 w-6 sm:h-8 sm:w-8 text-green-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-2xl sm:text-3xl lg:text-headline text-theme-primary mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {ventesAujourdhui}
                </motion.div>
                <div className="flex items-center text-caption sm:text-body text-theme-secondary">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                  <span className="text-green-500">+5% vs hier</span>
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
            <Card className={`${themeClasses.card} hover:${themeClasses.shadow.lg} transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-body sm:text-subtitle text-theme-primary">Revenus du Mois</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <DollarSign className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-lg sm:text-2xl lg:text-headline text-theme-primary mb-2 break-words"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {Number(revenusDuMois).toLocaleString()} FCFA
                </motion.div>
                <div className="flex items-center text-caption sm:text-body text-theme-secondary">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 mr-1 sm:mr-2" />
                  <span className="text-green-500">+8% vs mois dernier</span>
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
            <Card className={`${themeClasses.card} hover:${themeClasses.shadow.lg} transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3 sm:pb-4">
                <CardTitle className="text-body sm:text-subtitle text-theme-primary">Satisfaction Client</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`h-6 w-6 sm:h-8 sm:w-8 ${tauxSatisfaction >= 70 ? 'text-yellow-500' : 'text-red-500'}`}
                >
                  {tauxSatisfaction >= 70 ? (
                    <Smile className="h-6 w-6 sm:h-8 sm:w-8" />
                  ) : (
                    <Frown className="h-6 w-6 sm:h-8 sm:w-8" />
                  )}
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-2xl sm:text-3xl lg:text-headline text-theme-primary mb-3"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {tauxSatisfaction}%
                </motion.div>
                <Progress 
                  value={tauxSatisfaction} 
                  className="mt-2 h-3"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Graphiques et données */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8 grid-cols-1 lg:grid-cols-7">
          {/* Graphique des ventes */}
          <motion.div
            className="col-span-1 lg:col-span-4 order-2 lg:order-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className={`${themeClasses.card} hover:${themeClasses.shadow.lg} transition-all duration-300`}>
              <CardHeader className="pb-4 sm:pb-6">
                <CardTitle className="flex items-center text-subtitle sm:text-title text-theme-primary">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Activity className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-primary" />
                  </motion.div>
                  Évolution des Ventes
                </CardTitle>
                <CardDescription className="text-caption sm:text-body text-theme-secondary">
                  Performances des 6 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={ventesData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="mois" stroke="#9CA3AF" fontSize={14} />
                    <YAxis stroke="#9CA3AF" tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`} fontSize={14} />
                    <Tooltip 
                      formatter={(value) => [`${Number(value).toLocaleString()} FCFA`, 'Ventes']}
                      labelStyle={{ color: '#fff', fontSize: '16px' }}
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="ventes" 
                      stroke="#8B5CF6" 
                      fill="url(#colorVentes)" 
                      strokeWidth={3}
                    />
                    <defs>
                      <linearGradient id="colorVentes" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Activités récentes */}
          <motion.div
            className="col-span-1 lg:col-span-3 order-1 lg:order-2"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className={`${themeClasses.card} hover:${themeClasses.shadow.lg} transition-all duration-300`}>
              <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center text-subtitle sm:text-title text-theme-primary">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-500" />
                  </motion.div>
                  Activités Récentes
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className={`${themeClasses.card} border-primary/30 text-theme-primary hover:bg-primary/10 text-xs sm:text-sm`}
                  onClick={() => navigate('/activites')}
                >
                  <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Voir plus</span>
                  <span className="sm:hidden">Plus</span>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 sm:space-y-6">
                  {activitesRecentes.map((activite, index) => (
                    <motion.div 
                      key={activite.id} 
                      className="flex items-start space-x-3 sm:space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div 
                        className={`rounded-full p-2 sm:p-3 flex-shrink-0 ${
                          activite.type === 'vente' ? 'bg-green-500/20 text-green-400' :
                          activite.type === 'client' ? 'bg-blue-500/20 text-blue-400' :
                          activite.type === 'feedback' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {activite.type === 'vente' ? <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5" /> :
                         activite.type === 'client' ? <Users className="h-4 w-4 sm:h-5 sm:w-5" /> :
                         activite.type === 'feedback' ? <Smile className="h-4 w-4 sm:h-5 sm:w-5" /> :
                         <Activity className="h-4 w-4 sm:h-5 sm:w-5" />}
                      </motion.div>
                      <div className="space-y-1 sm:space-y-2 flex-1 min-w-0">
                        <p className="text-caption sm:text-body text-theme-primary break-words">
                          {activite.description}
                        </p>
                        <p className="text-xs sm:text-caption text-theme-muted">
                          {activite.time}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Tabs pour Clients et Feedbacks */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Tabs defaultValue="clients" className="space-y-6 sm:space-y-8">
            <TabsList className={`grid w-full grid-cols-2 max-w-md sm:max-w-lg mx-auto lg:mx-0 lg:w-[500px] ${themeClasses.card} h-12 sm:h-14`}>
              <TabsTrigger value="clients" className="text-sm sm:text-subtitle py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                <span className="hidden sm:inline">Derniers Clients</span>
                <span className="sm:hidden">Clients</span>
              </TabsTrigger>
              <TabsTrigger value="feedbacks" className="text-sm sm:text-subtitle py-2 sm:py-3 data-[state=active]:bg-primary data-[state=active]:text-white">
                <span className="hidden sm:inline">Feedbacks Récents</span>
                <span className="sm:hidden">Feedbacks</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={themeClasses.card}>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 space-y-2 sm:space-y-0">
                    <CardTitle className="text-subtitle sm:text-title text-theme-primary flex items-center">
                      <Users className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-blue-500" />
                      <span className="hidden sm:inline">Clients Récemment Ajoutés</span>
                      <span className="sm:hidden">Nouveaux Clients</span>
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`${themeClasses.card} border-primary/30 text-theme-primary hover:bg-primary/10 text-xs sm:text-sm`}
                      onClick={() => handleNavigation('/Afficher_client')}
                    >
                      <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Voir tous</span>
                      <span className="sm:hidden">Tous</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-theme-secondary text-caption sm:text-body min-w-[120px]">Client</TableHead>
                            <TableHead className="text-theme-secondary text-caption sm:text-body min-w-[100px] hidden sm:table-cell">Téléphone</TableHead>
                            <TableHead className="text-theme-secondary text-caption sm:text-body min-w-[80px]">Type</TableHead>
                            <TableHead className="text-theme-secondary text-caption sm:text-body min-w-[100px] hidden md:table-cell">Date d'ajout</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientsRecent.map((client, index) => (
                            <motion.tr 
                              key={client.id}
                              className="hover:bg-primary/5 transition-colors"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.4, delay: index * 0.1 }}
                              whileHover={{ scale: 1.01 }}
                            >
                              <TableCell className="py-3 sm:py-4">
                                <div className="flex items-center space-x-2 sm:space-x-4">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 border-2 border-primary/30">
                                      <AvatarFallback className="bg-gradient-primary text-white text-sm sm:text-base lg:text-lg">
                                        {client.nom?.charAt(0) || ''}{client.prenom?.charAt(0) || ''}
                                      </AvatarFallback>
                                    </Avatar>
                                  </motion.div>
                                  <div className="min-w-0 flex-1">
                                    <p className="text-theme-primary text-caption sm:text-body leading-none break-words">
                                      {client.nom} {client.prenom}
                                    </p>
                                    <p className="text-theme-secondary text-xs sm:text-caption mt-1 sm:hidden break-words">
                                      {client.telephone}
                                    </p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-theme-secondary text-caption sm:text-body hidden sm:table-cell">
                                {client.telephone}
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={client.type === 'Entreprise' ? 'default' : 'secondary'}
                                  className={`text-xs sm:text-sm px-2 py-1 ${
                                    client.type === 'Entreprise' 
                                      ? 'bg-primary/20 text-primary border-primary/30' 
                                      : 'bg-blue-500/20 text-blue-500 border-blue-500/30'
                                  }`}
                                >
                                  <span className="hidden sm:inline">{client.type}</span>
                                  <span className="sm:hidden">{client.type === 'Entreprise' ? 'Ent.' : 'Part.'}</span>
                                </Badge>
                              </TableCell>
                              <TableCell className="text-theme-muted text-caption sm:text-body hidden md:table-cell">
                                {client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>

            <TabsContent value="feedbacks" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className={themeClasses.card}>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 sm:pb-6 space-y-2 sm:space-y-0">
                    <CardTitle className="text-subtitle sm:text-title text-theme-primary flex items-center">
                      <Star className="mr-2 sm:mr-3 h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-yellow-500" />
                      <span className="hidden sm:inline">Derniers Retours Clients</span>
                      <span className="sm:hidden">Feedbacks</span>
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className={`${themeClasses.card} border-primary/30 text-theme-primary hover:bg-primary/10 text-xs sm:text-sm`}
                      onClick={() => handleNavigation('/admin/feedback')}
                    >
                      <Eye className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Voir tous</span>
                      <span className="sm:hidden">Tous</span>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                      {feedbacks.length === 0 ? (
                        <p className="text-theme-muted text-center py-8">Aucun feedback récent</p>
                      ) : (
                        feedbacks.slice(0, 4).map((feedback, index) => {
                          const client = feedback?.vente?.client;
                          return (
                            <motion.div 
                              key={feedback.id} 
                              className={`flex items-start space-x-3 sm:space-x-4 lg:space-x-6 p-3 sm:p-4 rounded-lg ${themeClasses.card} hover:${themeClasses.shadow.md} transition-all duration-300`}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <motion.div 
                                className={`rounded-full p-2 sm:p-3 lg:p-4 flex-shrink-0 ${
                                  feedback.satisfait ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                              >
                                {feedback.satisfait ? (
                                  <Smile className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                                ) : (
                                  <Frown className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                                )}
                              </motion.div>
                              <div className="space-y-2 sm:space-y-3 flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                                  <p className="text-theme-primary text-body sm:text-subtitle leading-none break-words">
                                    {client ? `${client.nom} ${client.prenom}` : 'Client inconnu'}
                                  </p>
                                  <Badge 
                                    variant={feedback.satisfait ? 'default' : 'destructive'}
                                    className={`text-xs sm:text-sm px-2 sm:px-3 py-1 w-fit ${
                                      feedback.satisfait 
                                        ? 'bg-green-500/20 text-green-500 border-green-500/30' 
                                        : 'bg-red-500/20 text-red-500 border-red-500/30'
                                    }`}
                                  >
                                    {feedback.satisfait ? 'Positif' : 'Négatif'}
                                  </Badge>
                                </div>
                                <p className="text-caption sm:text-body text-theme-secondary italic break-words">
                                  "{feedback.commentaire || (feedback.satisfait ? 'Très satisfait' : 'Insatisfait')}"
                                </p>
                                <p className="text-xs sm:text-caption text-theme-muted">
                                  {feedback.created_at ? new Date(feedback.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                                </p>
                              </div>
                            </motion.div>
                          );
                        })
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}