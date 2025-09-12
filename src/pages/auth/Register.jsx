import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Eye, 
  EyeOff, 
  CheckCircle, 
  User, 
  Lock, 
  Phone, 
  Building2, 
  MapPin, 
  Loader2, 
  UserPlus,
  Shield,
  TrendingUp,
  Target,
  Smartphone
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'

import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ApiService from '../../services/ApiService'
import Swal from 'sweetalert2'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [telephone, setTelephone] = useState('')
  const [domaineActivite, setDomaineActivite] = useState('')
  const [GIE, setGIE] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [isDarkMode, setIsDarkMode] = useState(true)
  
  const navigate = useNavigate()

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  const localNumber = telephone.replace(/^221/, '')

  const resetForm = () => {
    setUsername('')
    setPassword('')
    setPasswordConfirmation('')
    setTelephone('')
    setDomaineActivite('')
    setGIE('')
    setValidationErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setValidationErrors({})

    const errors = {}

    if (!username) {
      errors.username = "Le nom d'utilisateur est requis."
    } else if (username.length < 5) {
      errors.username = "Le nom d'utilisateur doit contenir au moins 5 caractères."
    } else if (username.length > 20) {
      errors.username = "Le nom d'utilisateur ne doit pas dépasser 20 caractères."
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      errors.username = "Le nom d'utilisateur ne doit contenir que des lettres, chiffres ou underscores."
    }

    if (!password) {
      errors.password = "Le mot de passe est requis."
    } else if (password.length < 8) {
      errors.password = "Le mot de passe doit contenir au moins 8 caractères."
    } else if (!/[0-9]/.test(password)) {
      errors.password = "Le mot de passe doit contenir au moins un chiffre."
    }

    if (!passwordConfirmation) {
      errors.password_confirmation = "La confirmation du mot de passe est requise."
    } else if (password !== passwordConfirmation) {
      errors.password_confirmation = "Les mots de passe ne correspondent pas."
    }

    if (!localNumber) {
      errors.telephone = "Le numéro de téléphone est requis."
    } else if (!/^\d{9}$/.test(localNumber)) {
      errors.telephone = "Le téléphone doit contenir exactement 9 chiffres."
    } else if (!/^(7[05678]\d{7})$/.test(localNumber)) {
      errors.telephone = "Numéro sénégalais invalide."
    }

    if (!domaineActivite) {
      errors.domaine_activite = "Le domaine d'activité est requis."
    }

    if (GIE && GIE.length < 3) {
      errors.GIE = "Le nom du GIE doit contenir au moins 3 caractères."
    } else if (GIE && !/^[a-zA-Z0-9\s\-']+$/.test(GIE)) {
      errors.GIE = "Le GIE ne doit contenir que des lettres, chiffres, tirets ou apostrophes."
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      setIsSubmitting(false)
      return
    }

    const formData = new FormData()
    formData.append('username', username)
    formData.append('password', password)
    formData.append('password_confirmation', passwordConfirmation)
    formData.append('telephone', telephone)
    formData.append('domaine_activite', domaineActivite)
    if (GIE) {
      formData.append('GIE', GIE)
    }

    try {
      await ApiService.register(formData)
      resetForm()
      
      Swal.fire({
        icon: 'success',
        title: 'Inscription réussie !',
        text: 'Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.',
        confirmButtonText: 'Se connecter',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b'
      }).then(() => {
        navigate('/login')
      })
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      if (error.response && error.response.data && error.response.data.errors) {
        setValidationErrors(error.response.data.errors)
      } else {
        setValidationErrors({general: "Une erreur est survenue, veuillez réessayer."})
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

  const domainesActivite = [
    { value: "halieutique", label: "Halieutique" },
    { value: "Agroalimentaire", label: "Agroalimentaire" },
    { value: "Artisanat local", label: "Artisanat local" },
    { value: "Savons / Cosmétiques", label: "Savons / Cosmétiques" },
    { value: "Jus locaux", label: "Jus locaux" }
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
                <UserPlus className="h-10 w-10 text-white" />
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
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
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
                    <UserPlus className="h-10 w-10 text-white" />
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
                
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Rejoignez KAM-DAAY !
                </CardTitle>
                <p className={`text-xl ${
                  isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                }`}>
                  Créez votre compte professionnel
                </p>
              </motion.div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="space-y-8"
              >
                {/* Grid pour nom d'utilisateur et mots de passe */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Nom d'utilisateur */}
                  <div className="lg:col-span-2 space-y-2">
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
                        }`}
                      />
                    </div>
                    {validationErrors.username && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{validationErrors.username}</span>
                      </p>
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
                        }`}
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
                    {validationErrors.password && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{validationErrors.password}</span>
                      </p>
                    )}
                  </div>

                  {/* Confirmation mot de passe */}
                  <div className="space-y-2">
                    <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Confirmation du mot de passe *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                      <Input
                        type={showPasswordConfirmation ? 'text' : 'password'}
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        placeholder="Confirmez votre mot de passe"
                        className={`pl-12 pr-12 h-12 text-base ${
                          isDarkMode 
                            ? 'bg-slate-800/50 border-slate-600' 
                            : 'bg-white/50 border-slate-300'
                        }`}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                        className="absolute right-0 top-0 h-full px-3 text-slate-500 hover:text-slate-700"
                      >
                        {showPasswordConfirmation ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </Button>
                    </div>
                    {validationErrors.password_confirmation && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{validationErrors.password_confirmation}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Grid pour téléphone et domaine */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Numéro WhatsApp */}
                  <div className="space-y-2">
                    <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} flex items-center space-x-2`}>
                      <Smartphone className="h-5 w-5 text-emerald-500" />
                      <span>Numéro WhatsApp *</span>
                    </Label>
                    <div className="relative">
                      <PhoneInput
                        country={'sn'}
                        value={telephone}
                        onChange={setTelephone}
                        inputProps={{
                          name: 'telephone',
                          required: true,
                          placeholder: 'Entrez votre numéro'
                        }}
                        enableSearch={true}
                        containerStyle={{
                          width: '100%',
                          borderRadius: '12px',
                          backgroundColor: 'transparent'
                        }}
                        inputStyle={{
                          width: '100%',
                          padding: '0.95rem 1rem 0.95rem 3.5rem',
                          border: `1px solid ${isDarkMode ? '#475569' : '#d1d5db'}`,
                          borderRadius: '12px',
                          backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                          color: isDarkMode ? 'white' : '#1e293b',
                          fontSize: '1rem',
                          height: '48px'
                        }}
                        buttonStyle={{
                          border: 'none',
                          background: 'transparent',
                          paddingLeft: '0.75rem',
                          height: '48px'
                        }}
                      />
                    </div>
                    {validationErrors.telephone && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{validationErrors.telephone}</span>
                      </p>
                    )}
                  </div>

                  {/* Domaine d'activité */}
                  <div className="space-y-2">
                    <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                      Domaine d'activité *
                    </Label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500 z-10" />
                      <Select value={domaineActivite} onValueChange={setDomaineActivite}>
                        <SelectTrigger className={`pl-12 h-12 text-base ${
                          isDarkMode 
                            ? 'bg-slate-800/50 border-slate-600' 
                            : 'bg-white/50 border-slate-300'
                        }`}>
                          <SelectValue placeholder="Choisir un domaine" />
                        </SelectTrigger>
                        <SelectContent>
                          {domainesActivite.map((domaine) => (
                            <SelectItem key={domaine.value} value={domaine.value}>
                              {domaine.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    {validationErrors.domaine_activite && (
                      <p className="text-red-500 text-sm flex items-center space-x-1">
                        <span>⚠️</span>
                        <span>{validationErrors.domaine_activite}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* GIE (optionnel) - Pleine largeur */}
                <div className="space-y-2">
                  <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} flex items-center space-x-2`}>
                    <MapPin className="h-5 w-5" />
                    <span>Nom du GIE</span>
                    <Badge variant="outline" className="text-xs">
                      Optionnel
                    </Badge>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      type="text"
                      value={GIE}
                      onChange={(e) => setGIE(e.target.value)}
                      placeholder="Nom de votre GIE"
                      className={`pl-12 h-12 text-base ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      }`}
                    />
                  </div>
                  {validationErrors.GIE && (
                    <p className="text-red-500 text-sm flex items-center space-x-1">
                      <span>⚠️</span>
                      <span>{validationErrors.GIE}</span>
                    </p>
                  )}
                </div>

                {/* Erreur générale */}
                {validationErrors.general && (
                  <div className="p-4 rounded-lg bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700">
                    <p className="text-red-600 dark:text-red-400 text-sm flex items-center space-x-2">
                      <span>❌</span>
                      <span>{validationErrors.general}</span>
                    </p>
                  </div>
                )}

                <Separator />

                {/* Bouton d'inscription */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg transition-all duration-300"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Création en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-6 w-6 mr-3" />
                      S'inscrire
                    </>
                  )}
                </Button>

                {/* Lien de connexion */}
                <div className="text-center pt-4">
                  <p className={`text-base ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Vous avez déjà un compte ?{' '}
                    <Link
                      to="/login"
                      className="font-semibold text-lg bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300"
                    >
                      Se connecter
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