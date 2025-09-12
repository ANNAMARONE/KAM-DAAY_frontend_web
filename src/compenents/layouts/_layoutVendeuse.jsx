import React, { useState, useEffect } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Home, 
  Users, 
  UserPlus, 
  ShoppingCart, 
  Bell, 
  Settings, 
  Package, 
  LogOut, 
  HelpCircle,
  Search,
  Sun,
  Moon,
  Bot,
  Sparkles,
  Menu,
  X,
  ChevronRight,
  Zap
} from 'lucide-react'

// Import du hook pour le thème
import { useTheme } from '/hooks/useTheme'

// Import des composants shadcn/ui
import { Button } from "../../components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"
import { Badge } from "../../components/ui/badge"
import { Separator } from "../../components/ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"

// Services API (ajustez selon votre configuration)
import ApiService from '../../services/ApiService';
import { PROFILE_BASE_URL } from '../../services/ApiService';

function LayoutVendeuse({ onSearch }) {
  // Hook pour le thème global
  const { isDarkMode, toggleTheme, getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  // Déconnexion
  const handleLogout = () => {
    ApiService.logout()
      .then(() => {
        localStorage.removeItem('token')
        navigate('/login')
      })
      .catch((error) => console.error('Erreur lors de la déconnexion:', error))
  }

  // Vérification de l'authentification
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) navigate('/login')
  }, [])

  // Recherche
  useEffect(() => {
    if (onSearch) onSearch(searchTerm)
  }, [searchTerm, onSearch])

  // Utilisateur connecté
  useEffect(() => {
    ApiService.getCurrentUser()
      .then((response) => setUser(response.data.user))
      .catch((error) => console.error('Erreur récupération utilisateur :', error))
  }, [])

  // Gestion du scroll si menu ouvert
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  const navigationItems = [
    { 
      to: "/dasboard", 
      icon: Home, 
      label: "Tableau de bord", 
      gradient: "from-blue-500 to-cyan-500",
      description: "Vue d'ensemble de vos activités"
    },
    { 
      to: "/Afficher_client", 
      icon: Users, 
      label: "Mes clients", 
      gradient: "from-green-500 to-emerald-500",
      description: "Gérer votre portefeuille client"
    },
    { 
      to: "/ventes", 
      icon: UserPlus, 
      label: "Ajouter un client", 
      gradient: "from-purple-500 to-violet-500",
      description: "Enrichir votre base clients"
    },
    { 
      to: "/afficher/ventes", 
      icon: ShoppingCart, 
      label: "Afficher mes ventes", 
      gradient: "from-orange-500 to-red-500",
      description: "Historique des transactions"
    },
    { 
      to: "/gestion/client", 
      icon: Settings, 
      label: "Gestion des Clients", 
      gradient: "from-pink-500 to-rose-500",
      description: "Outils de gestion avancés"
    },
    { 
      to: "/gestion/produit", 
      icon: Package, 
      label: "Gestion des produits", 
      gradient: "from-indigo-500 to-blue-500",
      description: "Catalogue et inventaire"
    }
  ]

  const handleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant)
    console.log('Ouverture de l\'assistant IA...')
    alert('🤖 Assistant IA activé !\n\nComment puis-je vous aider aujourd\'hui ?')
  }

  return (
    <div className={themeClasses.page}>
      {/* HEADER */}
      <motion.header 
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${themeClasses.card} border-primary/20`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-6">
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              <div className="p-2 rounded-xl bg-gradient-primary">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className="text-subtitle text-theme-primary">
                  KAM-DAAY
                </h1>
                <p className="text-caption text-theme-secondary">
                  Plateforme de vente moderne
                </p>
              </div>
            </motion.div>
          </div>

          <div className="flex items-center space-x-6">
            {/* Message de bienvenue */}
            {user && (
              <motion.div 
                className="hidden lg:block text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h2 className="text-subtitle text-theme-primary">
                  Bonjour, {user.username} ✨
                </h2>
                <p className="text-caption text-theme-secondary">
                  Prêt à conquérir de nouveaux marchés ?
                </p>
              </motion.div>
            )}

            {/* Barre de recherche */}
            <motion.div 
              className="relative hidden md:block"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-theme-muted" />
              <input
                type="text"
                placeholder="Rechercher..."
                className={`pl-10 pr-4 py-2 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-primary focus:border-transparent ${themeClasses.input}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </motion.div>

            {/* Notifications */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className={`rounded-xl ${themeClasses.card} border-primary/30 hover:bg-primary/10`}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Toggle du thème */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.button
                    onClick={toggleTheme}
                    className={`${themeClasses.card} p-3 rounded-xl flex items-center space-x-2 hover:scale-105 transition-all border-primary/30 hover:bg-primary/10`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isDarkMode ? (
                      <Sun className="h-4 w-4 text-yellow-500" />
                    ) : (
                      <Moon className="h-4 w-4 text-blue-500" />
                    )}
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isDarkMode ? 'Mode Clair' : 'Mode Sombre'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Bouton de déconnexion */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleLogout}
                      variant="outline"
                      size="icon"
                      className="rounded-xl border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/50"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Déconnexion</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Profil utilisateur */}
            {user && (
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <NavLink to="/profile">
                  <motion.div whileHover={{ scale: 1.05 }}>
                    <Avatar className="h-10 w-10 border-2 border-primary/30">
                      {user.profile ? (
                        <AvatarImage 
                          src={`${PROFILE_BASE_URL}/${user.profile}`} 
                          alt="Profil" 
                        />
                      ) : (
                        <AvatarFallback className="bg-gradient-primary text-white">
                          {user.username.charAt(0)}
                        </AvatarFallback>
                      )}
                    </Avatar>
                  </motion.div>
                </NavLink>
              </motion.div>
            )}

            {/* Toggle menu mobile */}
            <Button
              variant="outline"
              size="icon"
              className={`md:hidden rounded-xl ${themeClasses.card} border-primary/30`}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* BODY */}
      <div className="flex">
        {/* SIDEBAR */}
        <AnimatePresence>
          <motion.aside 
            className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] w-80 border-r backdrop-blur-md transition-all duration-300 z-40 ${themeClasses.card} border-primary/20 ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
            initial={{ x: -320 }}
            animate={{ x: menuOpen || (typeof window !== 'undefined' && window.innerWidth >= 768) ? 0 : -320 }}
            exit={{ x: -320 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="flex flex-col h-full p-6">
              <nav className="flex-1 space-y-3">
                {navigationItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <NavLink
                      to={item.to}
                      className={({ isActive }) => `
                        group relative flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]
                        ${isActive 
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg ${themeClasses.shadow.lg}` 
                          : `hover:bg-primary/10 text-theme-secondary hover:text-theme-primary`
                        }
                      `}
                      onClick={() => setMenuOpen(false)}
                    >
                      {({ isActive }) => (
                        <>
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.6 }}
                            className={`p-2 rounded-xl ${
                              isActive 
                                ? 'bg-white/20' 
                                : 'bg-primary/10 group-hover:bg-primary/20'
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="text-body">{item.label}</h3>
                            <p className={`text-caption opacity-75 ${isActive ? 'text-white/80' : 'text-theme-muted'}`}>
                              {item.description}
                            </p>
                          </div>
                          <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -10 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="h-4 w-4" />
                          </motion.div>
                        </>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <Separator className="my-6" />

              {/* Section inférieure avec Assistant IA */}
              <div className="space-y-4">
                {/* Assistant IA */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={handleAIAssistant}
                          className={`w-full justify-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                            showAIAssistant
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg'
                              : themeClasses.button
                          }`}
                        >
                          <motion.div
                            whileHover={{ scale: 1.2 }}
                            animate={{ 
                              rotate: showAIAssistant ? [0, 360] : 0,
                              scale: showAIAssistant ? [1, 1.1, 1] : 1 
                            }}
                            transition={{ 
                              duration: showAIAssistant ? 0.6 : 0.3,
                              repeat: showAIAssistant ? Infinity : 0,
                              repeatDelay: 2 
                            }}
                            className="p-2 rounded-xl bg-white/20"
                          >
                            <Bot className="h-5 w-5" />
                          </motion.div>
                          <div className="flex-1 text-left">
                            <h3 className="text-body flex items-center">
                              Assistant IA
                              <Zap className="h-4 w-4 ml-2" />
                            </h3>
                            <p className="text-caption opacity-90">
                              Aide intelligente 24/7
                            </p>
                          </div>
                          {showAIAssistant && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="w-2 h-2 bg-green-400 rounded-full"
                            />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Assistant IA pour vous aider</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>

                {/* Aide */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.0 }}
                >
                  <NavLink
                    to="/admin/aide"
                    className={({ isActive }) => `
                      group flex items-center space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02]
                      ${isActive 
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg' 
                        : 'hover:bg-primary/10 text-theme-secondary hover:text-theme-primary'
                      }
                    `}
                    onClick={() => setMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="p-2 rounded-xl bg-primary/10 group-hover:bg-primary/20"
                    >
                      <HelpCircle className="h-5 w-5" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-body">Aide & Support</h3>
                      <p className="text-caption opacity-75 text-theme-muted">
                        Documentation et tutoriels
                      </p>
                    </div>
                  </NavLink>
                </motion.div>
              </div>
            </div>
          </motion.aside>
        </AnimatePresence>

        {/* CONTENU PRINCIPAL */}
        <main className={`flex-1 transition-all duration-300 ${menuOpen ? 'md:ml-80' : 'md:ml-80'}`}>
          <motion.div 
            className="p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* Overlay pour mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default LayoutVendeuse