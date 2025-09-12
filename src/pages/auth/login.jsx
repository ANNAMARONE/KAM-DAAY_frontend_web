import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  User, 
  Lock, 
  Loader2,
  Target,
  TrendingUp,
  Shield,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Checkbox } from '../../components/ui/checkbox'
import { Separator } from '../../components/ui/separator'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog'

import ApiService from '../../services/ApiService'
import Swal from 'sweetalert2'

// Modal de mot de passe oublié (simple pour l'exemple)
function ForgotPasswordRequestModal({ onClose }) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulation d'envoi
    setTimeout(() => {
      Swal.fire({
        icon: 'success',
        title: 'Email envoyé !',
        text: 'Un lien de réinitialisation a été envoyé à votre adresse email.',
        confirmButtonText: 'OK'
      })
      setIsSubmitting(false)
      onClose()
    }, 2000)
  }

  return (
    <DialogContent className="sm:max-w-md bg-white dark:bg-slate-900 rounded-lg shadow-lg p-6">
    <DialogHeader>
      <DialogTitle className="text-lg font-semibold text-slate-800 dark:text-white">
        Réinitialiser le mot de passe
      </DialogTitle>
    </DialogHeader>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
          Adresse email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="votre@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white"
        />
      </div>
      <div className="flex space-x-2">
        <Button type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
          {isSubmitting ? 'Envoi...' : 'Envoyer le lien'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 text-gray-700 dark:text-gray-200">
          Annuler
        </Button>
      </div>
    </form>
  </DialogContent>
  
  )
}

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [usernameError, setUsernameError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  const validateForm = () => {
    let isValid = true
    setUsernameError('')
    setPasswordError('')

    if (username.trim() === '') {
      setUsernameError("Le nom d'utilisateur est requis.")
      isValid = false
    } else if (username.length < 5 || username.length > 20) {
      setUsernameError("Le nom d'utilisateur doit contenir entre 5 et 20 caractères.")
      isValid = false
    }

    if (password.trim() === '') {
      setPasswordError("Le mot de passe est requis.")
      isValid = false
    } else if (password.length < 4) {
      setPasswordError("Le mot de passe doit contenir au moins 8 caractères.")
      isValid = false
    }

    return isValid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      const response = await ApiService.login({ username, password })

      if (response.status === 200) {
        localStorage.setItem('token', response.data.token)
        localStorage.setItem('user', JSON.stringify(response.data.user))

        // Notification de succès
        Swal.fire({
          icon: 'success',
          title: 'Connexion réussie !',
          text: `Bienvenue ${response.data.user.username}`,
          showConfirmButton: false,
          timer: 2000,
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1e293b'
        }).then(() => {
          // Redirection selon le rôle
          if (response.data.user.role === 'admin') {
            window.location.href = '/Admin dasboard'
          } else if (response.data.user.role === 'vendeuse') {
            window.location.href = '/dasboard'
          }
        })
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        Swal.fire({
          icon: 'error',
          title: 'Erreur de connexion',
          text: "Nom d'utilisateur ou mot de passe incorrect.",
          confirmButtonText: 'Réessayer',
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1e293b'
        })
      } else {
        console.error("Erreur lors de la connexion:", error)
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: "Une erreur est survenue. Veuillez réessayer plus tard.",
          confirmButtonText: 'OK',
          background: isDarkMode ? '#1e293b' : '#ffffff',
          color: isDarkMode ? '#ffffff' : '#1e293b'
        })
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const avantages = [
    { icon: Target, text: "Suivez vos clients" },
    { icon: TrendingUp, text: "Gardez une trace de vos ventes" },
    { icon: Shield, text: "Prenez de meilleures décisions" }
  ]

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Partie gauche - Préservée avec améliorations */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
      >
        {/* Background avec overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/90 via-blue-900/80 to-indigo-900/90 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1710778044102-56a3a6b69a1b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwd29tYW4lMjBlbnRyZXByZW5ldXIlMjBidXNpbmVzcyUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NTc1ODk3NDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral')`
          }}
        ></div>
        
        {/* Contenu */}
        <div className="relative z-20 flex flex-col justify-center items-center text-center text-white px-12 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="space-y-8"
          >
            {/* Logo */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="p-3 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                <LogIn className="h-10 w-10 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-3xl font-bold text-white">KAM-DAAY</h1>
                <p className="text-purple-200 text-sm">VendePro Edition</p>
              </div>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight">
                Plateforme de<br />
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  gestion relation client
                </span>
              </h2>
              
              <div className="space-y-4 mt-8">
                {avantages.map((avantage, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                    className="flex items-center space-x-4 bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/20"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                      <avantage.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg text-white font-medium">{avantage.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Partie droite - Formulaire modernisé */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full max-w-2xl"
        >
          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/90 border-slate-700/50' 
              : 'bg-white/90 border-slate-200/50'
          } backdrop-blur-md shadow-2xl`}>
            <CardHeader className="text-center space-y-6 pb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    <LogIn className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-left">
                    <h1 className={`text-3xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      KAM-DAAY
                    </h1>
                    <p className={`text-base ${
                      isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                    }`}>
                      VendePro Edition
                    </p>
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Bon retour !
                </CardTitle>
                <p className={`text-lg ${
                  isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                }`}>
                  Connectez-vous à votre compte
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Nom d'utilisateur */}
                <div className="space-y-2">
                  <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Nom d'utilisateur *
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Votre nom d'utilisateur"
                      className={`pl-12 h-12 text-base ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      } ${usernameError ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {usernameError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center space-x-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{usernameError}</span>
                    </motion.p>
                  )}
                </div>

                {/* Mot de passe */}
                <div className="space-y-2">
                  <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Mot de passe *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Votre mot de passe"
                      className={`pl-12 pr-12 h-12 text-base ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      } ${passwordError ? 'border-red-500' : ''}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-0 top-0 h-full px-3 text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </Button>
                  </div>
                  {passwordError && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-sm flex items-center space-x-1"
                    >
                      <AlertCircle className="h-4 w-4" />
                      <span>{passwordError}</span>
                    </motion.p>
                  )}
                </div>

                {/* Options - Se souvenir / Mot de passe oublié */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="remember"
                      checked={rememberMe}
                      onCheckedChange={(checked) => setRememberMe(!!checked)}
                    />
                    <Label
                      htmlFor="remember"
                      className={`text-sm cursor-pointer ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-700'
                      }`}
                    >
                      Se souvenir de moi
                    </Label>
                  </div>

                  <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="link"
                        className="p-0 h-auto text-sm bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700"
                      >
                        Mot de passe oublié ?
                      </Button>
                    </DialogTrigger>
                    <ForgotPasswordRequestModal onClose={() => setShowForgotModal(false)} />
                  </Dialog>
                </div>

                <Separator />

                {/* Bouton de connexion */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <LogIn className="h-6 w-6 mr-3" />
                      Se connecter
                    </>
                  )}
                </Button>

                {/* Lien d'inscription */}
                <div className="text-center pt-4">
                  <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Vous n'avez pas encore de compte ?{' '}
                    <Link
                      to="/register"
                      className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Créer un compte
                    </Link>
                  </p>
                </div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
