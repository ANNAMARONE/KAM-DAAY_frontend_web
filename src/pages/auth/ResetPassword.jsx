import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'motion/react'
import { 
  Eye, 
  EyeOff, 
  KeyRound, 
  Shield, 
  Lock, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Smartphone
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import { Badge } from '../../components/ui/badge'

import ApiService from '../../services/ApiService'
import Swal from 'sweetalert2'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const token = searchParams.get('token')
  const telephone = searchParams.get('telephone')

  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)
  const [errors, setErrors] = useState<any>({})
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  // Vérification des paramètres au démarrage
  useEffect(() => {
    if (!token || !telephone) {
      Swal.fire({
        icon: 'error',
        title: 'Lien invalide',
        text: 'Token ou numéro de téléphone manquant dans le lien.',
        confirmButtonText: 'Retour à la connexion',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b'
      }).then(() => {
        navigate('/login')
      })
    }
  }, [token, telephone, navigate, isDarkMode])

  // Réinitialiser les erreurs quand les champs changent
  useEffect(() => {
    if (errors.password && password) setErrors(prev => ({ ...prev, password: '' }))
  }, [password])

  useEffect(() => {
    if (errors.passwordConfirmation && passwordConfirmation) {
      setErrors(prev => ({ ...prev, passwordConfirmation: '' }))
    }
  }, [passwordConfirmation])

  const validateForm = () => {
    const newErrors = {}

    if (!password) {
      newErrors.password = "Le mot de passe est requis."
    } else if (password.length < 8) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères."
    } else if (!/[0-9]/.test(password)) {
      newErrors.password = "Le mot de passe doit contenir au moins un chiffre."
    }

    if (!passwordConfirmation) {
      newErrors.passwordConfirmation = "La confirmation du mot de passe est requise."
    } else if (password !== passwordConfirmation) {
      newErrors.passwordConfirmation = "Les mots de passe ne correspondent pas."
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      const response = await ApiService.resetPassword({
        token,
        telephone,
        password,
        password_confirmation: passwordConfirmation,
      })

      Swal.fire({
        icon: 'success',
        title: 'Mot de passe réinitialisé !',
        text: response.data.message || 'Votre mot de passe a été modifié avec succès.',
        confirmButtonText: 'Se connecter',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b'
      }).then(() => {
        navigate('/login')
      })
    } catch (err) {
      console.error('Erreur lors de la réinitialisation:', err)
      
      const errorMessage = err.response?.data?.error || 'Une erreur est survenue lors de la réinitialisation.'
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        confirmButtonText: 'Réessayer',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b'
      })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    const levels = [
      { strength: 0, label: '', color: '' },
      { strength: 1, label: 'Très faible', color: 'bg-red-500' },
      { strength: 2, label: 'Faible', color: 'bg-orange-500' },
      { strength: 3, label: 'Moyen', color: 'bg-yellow-500' },
      { strength: 4, label: 'Fort', color: 'bg-blue-500' },
      { strength: 5, label: 'Très fort', color: 'bg-emerald-500' }
    ]

    return levels[strength]
  }

  const passwordStrength = getPasswordStrength(password)

  if (!token || !telephone) {
    return null // Le useEffect gérera la redirection
  }

  return (
    <div className={`min-h-screen flex transition-all duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      <div className="w-full flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-lg"
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
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                {/* Bouton retour */}
                <div className="flex justify-start mb-6">
                  <Button
                    variant="ghost"
                    onClick={() => navigate('/login')}
                    className={`flex items-center space-x-2 ${
                      isDarkMode 
                        ? 'text-slate-400 hover:text-white hover:bg-slate-800' 
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Retour à la connexion</span>
                  </Button>
                </div>

                {/* Icône et titre */}
                <div className="flex justify-center mb-6">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    <KeyRound className="h-10 w-10 text-white" />
                  </div>
                </div>
                
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Nouveau mot de passe
                </CardTitle>
                <p className={`text-lg ${
                  isDarkMode ? 'text-purple-300' : 'text-indigo-600'
                }`}>
                  Choisissez un mot de passe sécurisé
                </p>

                {/* Information sur le numéro */}
                <div className={`flex items-center justify-center space-x-2 p-3 rounded-lg ${
                  isDarkMode 
                    ? 'bg-slate-800/50 border border-slate-700' 
                    : 'bg-slate-50 border border-slate-200'
                }`}>
                  <Smartphone className="h-4 w-4 text-emerald-500" />
                  <span className={`text-sm ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Réinitialisation pour : {telephone}
                  </span>
                </div>
              </motion.div>
            </CardHeader>

            <CardContent className="px-8 pb-8">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Nouveau mot de passe */}
                <div className="space-y-2">
                  <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Nouveau mot de passe *
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Votre nouveau mot de passe"
                      className={`pl-12 pr-12 h-12 text-base ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      } ${errors.password ? 'border-red-500' : ''}`}
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

                  {/* Indicateur de force du mot de passe */}
                  <AnimatePresence>
                    {password && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <div className={`h-2 flex-1 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden`}>
                            <div 
                              className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                              style={{ width: `${(passwordStrength.strength / 5) * 100}%` }}
                            />
                          </div>
                          {passwordStrength.label && (
                            <Badge variant="outline" className="text-xs">
                              {passwordStrength.label}
                            </Badge>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message d'erreur */}
                  <AnimatePresence>
                    {errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm flex items-center space-x-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.password}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Confirmation du mot de passe */}
                <div className="space-y-2">
                  <Label className={`text-base ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    Confirmer le mot de passe *
                  </Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-500" />
                    <Input
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={passwordConfirmation}
                      onChange={(e) => setPasswordConfirmation(e.target.value)}
                      placeholder="Confirmez votre mot de passe"
                      className={`pl-12 pr-12 h-12 text-base ${
                        isDarkMode 
                          ? 'bg-slate-800/50 border-slate-600' 
                          : 'bg-white/50 border-slate-300'
                      } ${errors.passwordConfirmation ? 'border-red-500' : ''}`}
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

                  {/* Indicateur de correspondance */}
                  <AnimatePresence>
                    {passwordConfirmation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-center space-x-2"
                      >
                        {password === passwordConfirmation ? (
                          <div className="flex items-center space-x-2 text-emerald-500">
                            <CheckCircle className="h-4 w-4" />
                            <span className="text-sm">Les mots de passe correspondent</span>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2 text-red-500">
                            <AlertCircle className="h-4 w-4" />
                            <span className="text-sm">Les mots de passe ne correspondent pas</span>
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message d'erreur */}
                  <AnimatePresence>
                    {errors.passwordConfirmation && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-red-500 text-sm flex items-center space-x-1"
                      >
                        <AlertCircle className="h-4 w-4" />
                        <span>{errors.passwordConfirmation}</span>
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Conseils de sécurité */}
                <div className={`p-4 rounded-lg border ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border-blue-700/30' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-start space-x-3">
                    <Shield className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className={`font-medium ${
                        isDarkMode ? 'text-blue-300' : 'text-blue-800'
                      }`}>
                        Conseils pour un mot de passe sécurisé :
                      </h4>
                      <ul className={`text-sm space-y-1 ${
                        isDarkMode ? 'text-blue-200' : 'text-blue-700'
                      }`}>
                        <li>• Au moins 8 caractères</li>
                        <li>• Inclure des chiffres et des lettres</li>
                        <li>• Éviter les mots de passe évidents</li>
                        <li>• Utiliser un mot de passe unique</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Bouton de réinitialisation */}
                <Button
                  type="submit"
                  disabled={loading || !password || !passwordConfirmation || password !== passwordConfirmation}
                  className="w-full py-4 h-14 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg transition-all duration-300"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-6 w-6 mr-3 animate-spin" />
                      Réinitialisation en cours...
                    </>
                  ) : (
                    <>
                      <KeyRound className="h-6 w-6 mr-3" />
                      Réinitialiser le mot de passe
                    </>
                  )}
                </Button>

                {/* Information de sécurité */}
                <div className="text-center pt-4">
                  <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Après la réinitialisation, vous serez redirigé vers la page de connexion
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