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
import Logo from '../../assets/images/logo_light.png'
import '../../styles/_layouts.css'
import '../../styles/theme.css'
import '../../index.css'
import ApiService, { PROFILE_BASE_URL } from '../../services/ApiService'

// Classes CSS pour remplacer les composants shadcn temporairement
const buttonStyles = {
  base: "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-500",
  primary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg",
  outline: "border border-slate-300 bg-white/50 text-slate-700 hover:bg-slate-100/70 dark:border-slate-600 dark:bg-slate-800/50 dark:text-slate-300 dark:hover:bg-slate-700/50",
  icon: "h-10 w-10"
}

const avatarStyles = "h-10 w-10 rounded-full border-2 border-purple-500/30 bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center text-white font-semibold"

const badgeStyles = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-red-500 text-white"

// Composants temporaires pour remplacer shadcn
const Button = ({ children, variant = "primary", size = "default", className = "", onClick, ...props }) => {
  const sizeClass = size === "icon" ? buttonStyles.icon : "";
  const variantClass = variant === "outline" ? buttonStyles.outline : buttonStyles.primary;
  
  return (
    <button 
      className={`${buttonStyles.base} ${variantClass} ${sizeClass} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

const Avatar = ({ children, className = "" }) => (
  <div className={`${avatarStyles} ${className}`}>
    {children}
  </div>
);

const Badge = ({ children, className = "" }) => (
  <span className={`${badgeStyles} ${className}`}>
    {children}
  </span>
);

const Separator = ({ className = "" }) => (
  <hr className={`border-slate-300 dark:border-slate-600 ${className}`} />
);

const Tooltip = ({ children }) => children;
const TooltipProvider = ({ children }) => children;
const TooltipTrigger = ({ children, asChild }) => children;
const TooltipContent = ({ children }) => (
  <div className="absolute z-50 rounded-md bg-slate-900 px-2 py-1 text-xs text-white shadow-lg">
    {children}
  </div>
);

function LayoutVendeuse({ onSearch }) {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [showAIAssistant, setShowAIAssistant] = useState(false)

  // Gestion du thème
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setIsDarkMode(savedTheme === 'light')
    }
  }, [])


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

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleAIAssistant = () => {
    setShowAIAssistant(!showAIAssistant)
    console.log('Ouverture de l\'assistant IA...')
    alert('🤖 Assistant IA activé !\n\nComment puis-je vous aider aujourd\'hui ?')
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* HEADER */}
      <motion.header 
        className={`sticky top-0 z-50 border-b backdrop-blur-md transition-all duration-300 ${
          isDarkMode 
            ? 'bg-slate-900/80 border-slate-700/50' 
            : 'bg-white/80 border-slate-200/50'
        }`}
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
              <div className={`p-2 rounded-xl ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600'
              }`}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div className="hidden md:block">
                <h1 className={`text-xl font-bold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  KAM-DAAY
                </h1>
                <p className={`text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
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
                <h2 className={`text-lg font-semibold ${
                  isDarkMode ? 'text-white' : 'text-slate-800'
                }`}>
                  Bonjour, {user.username} ✨
                </h2>
                <p className={`text-sm ${
                  isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                }`}>
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
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
                isDarkMode ? 'text-slate-400' : 'text-slate-500'
              }`} />
              <input
                type="text"
                placeholder="Rechercher..."
                className={`pl-10 pr-4 py-2 rounded-xl border transition-all duration-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border-slate-600 text-white placeholder-slate-400' 
                    : 'bg-white/50 border-slate-300 text-slate-800 placeholder-slate-500'
                }`}
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
                      className={`rounded-xl ${
                        isDarkMode 
                          ? 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50' 
                          : 'border-slate-300 bg-white/50 hover:bg-slate-100/50'
                      }`}
                    >
                      <Bell className="h-4 w-4" />
                    </Button>
                    <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gradient-to-r from-red-500 to-pink-500 text-xs p-0 flex items-center justify-center">
                      3
                    </Badge>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent>
                
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
                    <Avatar className="h-10 w-10 border-2 border-purple-500/30">
                      {user.profile ? (
                        <img 
                          src={`${PROFILE_BASE_URL}/${user.profile}`} 
                          alt="Profil" 
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-semibold">
                          {user.username.charAt(0)}
                        </span>
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
              className={`md:hidden rounded-xl ${
                isDarkMode 
                  ? 'border-slate-600 bg-slate-800/50' 
                  : 'border-slate-300 bg-white/50'
              }`}
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
            className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] w-80 border-r backdrop-blur-md transition-all duration-300 z-40 ${
              isDarkMode 
                ? 'bg-slate-900/90 border-slate-700/50' 
                : 'bg-white/90 border-slate-200/50'
            } ${menuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
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
                          ? `bg-gradient-to-r ${item.gradient} text-white shadow-lg shadow-purple-500/25` 
                          : isDarkMode 
                            ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white' 
                            : 'hover:bg-slate-100/50 text-slate-600 hover:text-slate-800'
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
                                : isDarkMode 
                                  ? 'bg-slate-700/50 group-hover:bg-slate-600/50' 
                                  : 'bg-slate-200/50 group-hover:bg-slate-300/50'
                            }`}
                          >
                            <item.icon className="h-5 w-5" />
                          </motion.div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-base">{item.label}</h3>
                            <p className={`text-sm opacity-75 ${isActive ? 'text-white/80' : ''}`}>
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

              <Separator className={`my-6 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

              {/* Section inférieure avec thème et IA */}
              <div className="space-y-4">
                {/* Toggle thème */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={toggleTheme}
                          className={`w-full justify-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] ${
                            isDarkMode 
                              ? 'border-slate-600 bg-slate-800/50 hover:bg-slate-700/50 text-slate-300 hover:text-white' 
                              : 'border-slate-300 bg-slate-100/50 hover:bg-slate-200/50 text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <motion.div
                            whileHover={{ rotate: 180 }}
                            transition={{ duration: 0.6 }}
                            className={`p-2 rounded-xl ${
                              isDarkMode 
                                ? 'bg-gradient-to-r from-yellow-500 to-orange-500' 
                                : 'bg-gradient-to-r from-slate-600 to-slate-800'
                            }`}
                          >
                            {isDarkMode ? (
                              <Sun className="h-5 w-5 text-white" />
                            ) : (
                              <Moon className="h-5 w-5 text-white" />
                            )}
                          </motion.div>
                          <div className="flex-1 text-left">
                            <h3 className="font-semibold text-base">
                              {isDarkMode ? 'Mode Clair' : 'Mode Sombre'}
                            </h3>
                            <p className="text-sm opacity-75">
                              {isDarkMode ? 'Basculer vers le thème clair' : 'Basculer vers le thème sombre'}
                            </p>
                          </div>
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Changer le thème</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </motion.div>

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
                              ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25'
                              : isDarkMode 
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white' 
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white'
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
                            <h3 className="font-semibold text-base flex items-center">
                              Assistant IA
                              <Zap className="h-4 w-4 ml-2" />
                            </h3>
                            <p className="text-sm opacity-90">
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
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25' 
                        : isDarkMode 
                          ? 'hover:bg-slate-800/50 text-slate-300 hover:text-white' 
                          : 'hover:bg-slate-100/50 text-slate-600 hover:text-slate-800'
                      }
                    `}
                    onClick={() => setMenuOpen(false)}
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`p-2 rounded-xl ${
                        isDarkMode 
                          ? 'bg-slate-700/50 group-hover:bg-slate-600/50' 
                          : 'bg-slate-200/50 group-hover:bg-slate-300/50'
                      }`}
                    >
                      <HelpCircle className="h-5 w-5" />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-base">Aide & Support</h3>
                      <p className="text-sm opacity-75">
                        Documentation et tutoriels
                      </p>
                    </div>
                  </NavLink>
                </motion.div>

                <Separator className={`my-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />

                {/* Déconnexion */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.1 }}
                >
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className={`w-full justify-start space-x-4 p-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] border-red-500/30 text-red-500 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500/50`}
                  >
                    <motion.div
                      whileHover={{ rotate: 180 }}
                      transition={{ duration: 0.6 }}
                      className="p-2 rounded-xl bg-red-500/20"
                    >
                      <LogOut className="h-5 w-5" />
                    </motion.div>
                    <div className="flex-1 text-left">
                      <h3 className="font-semibold text-base">Déconnexion</h3>
                      <p className="text-sm opacity-75">
                        Se déconnecter en toute sécurité
                      </p>
                    </div>
                  </Button>
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