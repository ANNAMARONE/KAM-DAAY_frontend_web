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
  Target
} from 'lucide-react';
import { motion } from 'motion/react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';

// Mock ApiService pour la démo
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

// Données statiques pour les activités récentes (comme demandé)
const activitesRecentes = [
  { id: 1, type: 'vente', description: 'Nouvelle vente - Kouadio Jean', time: 'Il y a 2 min' },
  { id: 2, type: 'client', description: 'Nouveau client - Diabaté Fatou', time: 'Il y a 15 min' },
  { id: 3, type: 'feedback', description: 'Nouveau feedback positif', time: 'Il y a 1h' },
  { id: 4, type: 'vente', description: 'Vente annulée - Commande #1234', time: 'Il y a 2h' }
];

export default function DashboardVendeuse() {
  const [clients, setClients] = useState([]);
  const [nombreClients, setNombreClients] = useState(0);
  const [ventesAujourdhui, setVentesAujourdhui] = useState(0);
  const [revenusDuMois, setRevenusDuMois] = useState(0);
  const [tauxSatisfaction, setTauxSatisfaction] = useState(0);
  const [ventesParMois, setVentesParMois] = useState({});
  const [feedbacks, setFeedbacks] = useState([]);
  const [clientsRecent, setClientsRecent] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            className="text-xl text-purple-200"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
     <div className="p-8 space-y-10 w-full mx-auto">


        {/* En-tête */}
        <motion.div 
          className="flex flex-col space-y-6 md:flex-row md:items-center md:justify-between md:space-y-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="space-y-3">
            <motion.h1 
              className="text-6xl text-white tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Tableau de Bord
            </motion.h1>
            <motion.p 
              className="text-xl text-purple-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Bienvenue sur votre dashboard de vente moderne
            </motion.p>
          </div>
          <motion.div 
            className="flex space-x-4"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Button 
              variant="outline" 
              className="bg-slate-800/50 border-purple-500 text-purple-300 hover:bg-purple-500/20 text-lg px-6 py-3"
              onClick={() => handleNavigation('/rapports')}
            >
              <BarChart3 className="mr-3 h-5 w-5" />
              Rapports
            </Button>
            <Button 
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-lg px-6 py-3"
              onClick={() => handleNavigation('/admin/clients/ajouter')}
            >
              <UserPlus className="mr-3 h-5 w-5" />
              Ajouter un client
            </Button>
          </motion.div>
        </motion.div>

        {/* Cartes de statistiques principales */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            whileHover={{ scale: 1.02, y: -5 }}
          >
        <Card className="w-full  bg-gradient-to-br from-blue-900/80 to-blue-800/60 border-blue-500/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300">
  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
    <CardTitle className="text-lg text-blue-100">Total Clients</CardTitle>
    <motion.div
      whileHover={{ rotate: 360 }}
      transition={{ duration: 0.6 }}
    >
      <Users className="h-8 w-8 text-blue-400" />
    </motion.div>
  </CardHeader>
  <CardContent>
    <motion.div 
      className="text-4xl text-white mb-2"
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      {nombreClients}
    </motion.div>
    <div className="flex items-center text-base text-blue-200">
      <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
      <span className="text-green-400">+12% ce mois</span>
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
            <Card className="bg-gradient-to-br from-green-900/80 to-green-800/60 border-green-500/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-green-500/25 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg text-green-100">Ventes Aujourd'hui</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <ShoppingCart className="h-8 w-8 text-green-400" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-4xl text-white mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  {ventesAujourdhui}
                </motion.div>
                <div className="flex items-center text-base text-green-200">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-green-400">+5% vs hier</span>
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
            <Card className="bg-gradient-to-br from-purple-900/80 to-purple-800/60 border-purple-500/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg text-purple-100">Revenus du Mois</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <DollarSign className="h-8 w-8 text-purple-400" />
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className="text-4xl text-white mb-2"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  {Number(revenusDuMois).toLocaleString()} FCFA
                </motion.div>
                <div className="flex items-center text-base text-purple-200">
                  <TrendingUp className="h-4 w-4 text-green-400 mr-2" />
                  <span className="text-green-400">+8% vs mois dernier</span>
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
            <Card className="bg-gradient-to-br from-yellow-900/80 to-orange-800/60 border-yellow-500/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className="text-lg text-yellow-100">Satisfaction Client</CardTitle>
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className={`h-8 w-8 ${tauxSatisfaction >= 70 ? 'text-yellow-400' : 'text-red-400'}`}
                >
                  {tauxSatisfaction >= 70 ? (
                    <Smile className="h-8 w-8" />
                  ) : (
                    <Frown className="h-8 w-8" />
                  )}
                </motion.div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  className={`text-4xl text-white mb-3`}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  {tauxSatisfaction}%
                </motion.div>
                <Progress 
                  value={tauxSatisfaction} 
                  className="mt-2 h-3 bg-slate-700"
                />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Graphiques et données */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-7">
          {/* Graphique des ventes */}
          <motion.div
            className="col-span-4"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300">
              <CardHeader className="pb-6">
                <CardTitle className="flex items-center text-2xl text-white">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Activity className="mr-3 h-7 w-7 text-purple-400" />
                  </motion.div>
                  Évolution des Ventes
                </CardTitle>
                <CardDescription className="text-lg text-slate-300">
                  Performances des 6 derniers mois
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
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
            className="col-span-3"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between pb-6">
                <CardTitle className="flex items-center text-2xl text-white">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Clock className="mr-3 h-7 w-7 text-blue-400" />
                  </motion.div>
                  Activités Récentes
                </CardTitle>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-slate-700/50 border-slate-500 text-slate-300 hover:bg-slate-600"
                  onClick={() => handleNavigation('/activites')}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Voir plus
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {activitesRecentes.map((activite, index) => (
                    <motion.div 
                      key={activite.id} 
                      className="flex items-start space-x-4"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.02, x: 5 }}
                    >
                      <motion.div 
                        className={`rounded-full p-3 ${
                          activite.type === 'vente' ? 'bg-green-500/20 text-green-400' :
                          activite.type === 'client' ? 'bg-blue-500/20 text-blue-400' :
                          activite.type === 'feedback' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                      >
                        {activite.type === 'vente' ? <ShoppingCart className="h-5 w-5" /> :
                         activite.type === 'client' ? <Users className="h-5 w-5" /> :
                         activite.type === 'feedback' ? <Smile className="h-5 w-5" /> :
                         <Activity className="h-5 w-5" />}
                      </motion.div>
                      <div className="space-y-2 flex-1">
                        <p className="text-base leading-none text-white">
                          {activite.description}
                        </p>
                        <p className="text-sm text-slate-400">
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
          <Tabs defaultValue="clients" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 lg:w-[500px] bg-slate-800/60 border-slate-600/30 h-14">
              <TabsTrigger value="clients" className="text-lg py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Derniers Clients
              </TabsTrigger>
              <TabsTrigger value="feedbacks" className="text-lg py-3 data-[state=active]:bg-purple-600 data-[state=active]:text-white">
                Feedbacks Récents
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clients" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <CardTitle className="text-2xl text-white flex items-center">
                      <Users className="mr-3 h-7 w-7 text-blue-400" />
                      Clients Récemment Ajoutés
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-slate-700/50 border-slate-500 text-slate-300 hover:bg-slate-600"
                      onClick={() => handleNavigation('/Afficher_client')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir tous
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow className="border-slate-600/50">
                          <TableHead className="text-slate-300 text-base">Client</TableHead>
                          <TableHead className="text-slate-300 text-base">Téléphone</TableHead>
                          <TableHead className="text-slate-300 text-base">Type</TableHead>
                          <TableHead className="text-slate-300 text-base">Date d'ajout</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientsRecent.map((client, index) => (
                          <motion.tr 
                            key={client.id}
                            className="border-slate-600/30 hover:bg-slate-700/30 transition-colors"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.1 }}
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
                                      {client.nom?.charAt(0) || ''}{client.prenom?.charAt(0) || ''}
                                    </AvatarFallback>
                                  </Avatar>
                                </motion.div>
                                <div>
                                  <p className="text-white text-lg leading-none">
                                    {client.nom} {client.prenom}
                                  </p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-slate-300 text-base">{client.telephone}</TableCell>
                            <TableCell>
                              <Badge 
                                variant={client.type === 'Entreprise' ? 'default' : 'secondary'}
                                className={`text-base px-3 py-1 ${
                                  client.type === 'Entreprise' 
                                    ? 'bg-purple-600/20 text-purple-300 border-purple-500/30' 
                                    : 'bg-blue-600/20 text-blue-300 border-blue-500/30'
                                }`}
                              >
                                {client.type}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-slate-400 text-base">
                              {client.created_at ? new Date(client.created_at).toLocaleDateString('fr-FR') : 'N/A'}
                            </TableCell>
                          </motion.tr>
                        ))}
                      </TableBody>
                    </Table>
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
                <Card className="bg-slate-800/60 border-slate-600/30 backdrop-blur-sm">
                  <CardHeader className="flex flex-row items-center justify-between pb-6">
                    <CardTitle className="text-2xl text-white flex items-center">
                      <Star className="mr-3 h-7 w-7 text-yellow-400" />
                      Derniers Retours Clients
                    </CardTitle>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="bg-slate-700/50 border-slate-500 text-slate-300 hover:bg-slate-600"
                      onClick={() => handleNavigation('/admin/feedback')}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Voir tous
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {feedbacks.length === 0 ? (
                        <p className="text-slate-400 text-center py-8">Aucun feedback récent</p>
                      ) : (
                        feedbacks.slice(0, 4).map((feedback, index) => {
                          const client = feedback?.vente?.client;
                          return (
                            <motion.div 
                              key={feedback.id} 
                              className="flex items-start space-x-6 p-4 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition-all duration-300"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              whileHover={{ scale: 1.02, x: 5 }}
                            >
                              <motion.div 
                                className={`rounded-full p-4 ${
                                  feedback.satisfait ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                                }`}
                                whileHover={{ rotate: 360, scale: 1.1 }}
                                transition={{ duration: 0.6 }}
                              >
                                {feedback.satisfait ? <Smile className="h-7 w-7" /> : <Frown className="h-7 w-7" />}
                              </motion.div>
                              <div className="space-y-3 flex-1">
                                <div className="flex items-center justify-between">
                                  <p className="text-white text-xl leading-none">
                                    {client ? `${client.nom} ${client.prenom}` : 'Client inconnu'}
                                  </p>
                                  <Badge 
                                    variant={feedback.satisfait ? 'default' : 'destructive'}
                                    className={`text-base px-4 py-2 ${
                                      feedback.satisfait 
                                        ? 'bg-green-600/20 text-green-300 border-green-500/30' 
                                        : 'bg-red-600/20 text-red-300 border-red-500/30'
                                    }`}
                                  >
                                    {feedback.satisfait ? 'Positif' : 'Négatif'}
                                  </Badge>
                                </div>
                                <p className="text-base text-slate-300 italic">
                                  "{feedback.commentaire || (feedback.satisfait ? 'Très satisfait' : 'Insatisfait')}"
                                </p>
                                <p className="text-sm text-slate-500">
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