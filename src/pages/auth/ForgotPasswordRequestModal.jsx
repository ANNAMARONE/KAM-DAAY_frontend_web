import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { useNavigate } from 'react-router-dom'
import { X, Smartphone, Loader2, KeyRound, Send, AlertCircle, CheckCircle } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Separator } from '../../components/ui/separator'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import ApiService from '../../services/ApiService'
import Swal from 'sweetalert2'



export default function ForgotPasswordRequestModal({ onClose }) {
  const [telephone, setTelephone] = useState('')
  const [loading, setLoading] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  // Réinitialiser l'erreur quand le téléphone change
  useEffect(() => {
    if (error) setError('')
  }, [telephone])

  const validatePhone = () => {
    const localNumber = telephone.replace(/^221/, '')
    
    if (!telephone || telephone.trim().length < 8) {
      setError('Veuillez entrer un numéro de téléphone valide.')
      return false
    }
    
    if (!/^\d{9}$/.test(localNumber)) {
      setError('Le téléphone doit contenir exactement 9 chiffres.')
      return false
    }
    
    if (!/^(7[05678]\d{7})$/.test(localNumber)) {
      setError('Numéro sénégalais invalide.')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validatePhone()) {
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('telephone', telephone)

      const response = await ApiService.forgotPassword(formData)

      // Notification de succès
      Swal.fire({
        icon: 'success',
        title: 'Lien envoyé !',
        text: 'Un lien de réinitialisation a été généré avec succès.',
        showConfirmButton: false,
        timer: 2000,
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b'
      }).then(() => {
        // Redirection vers la page de réinitialisation avec token et téléphone
        const { token, telephone: tel } = response.data
        navigate(`/reset-password?token=${token}&telephone=${tel}`)
        onClose()
      })

    } catch (err) {
      console.error('Erreur API forgotPassword:', err)
      
      const errorMessage = err.response?.data?.message || "Une erreur est survenue. Veuillez réessayer plus tard."
      
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: errorMessage,
        confirmButtonText: 'Réessayer',
        background: isDarkMode ? '#1e293b' : '#ffffff',
        color: isDarkMode ? '#ffffff' : '#1e293b'
      })
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-md"
        >
          <Card className={`border-purple-500/20 ${
            isDarkMode 
              ? 'bg-slate-900/95 border-slate-700/50' 
              : 'bg-white/95 border-slate-200/50'
          } backdrop-blur-md shadow-2xl`}>
            <CardHeader className="relative">
              {/* Bouton de fermeture */}
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className={`absolute top-4 right-4 h-8 w-8 rounded-full ${
                  isDarkMode 
                    ? 'hover:bg-slate-800 text-slate-400 hover:text-white' 
                    : 'hover:bg-slate-100 text-slate-600 hover:text-slate-900'
                }`}
              >
                <X className="h-4 w-4" />
              </Button>

              <div className="text-center space-y-4 pr-8">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="flex justify-center"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
                    <KeyRound className="h-8 w-8 text-white" />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Mot de passe oublié ?
                  </CardTitle>
                  <p className={`text-sm mt-2 ${
                    isDarkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Entrez votre numéro de téléphone pour recevoir un lien de réinitialisation
                  </p>
                </motion.div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-6"
              >
                {/* Champ téléphone */}
                <div className="space-y-2">
                  <Label className={`text-base flex items-center space-x-2 ${
                    isDarkMode ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    <Smartphone className="h-4 w-4 text-emerald-500" />
                    <span>Numéro de téléphone *</span>
                  </Label>
                  
                  <div className="relative">
                    <PhoneInput
                      country={'sn'} // Sénégal par défaut
                      value={telephone}
                      onChange={setTelephone}
                      inputProps={{
                        name: 'telephone',
                        required: true,
                        placeholder: 'Entrez votre numéro',
                        disabled: loading
                      }}
                      enableSearch={true}
                      containerStyle={{
                        width: '100%',
                        borderRadius: '12px',
                        backgroundColor: 'transparent',
                        opacity: loading ? 0.6 : 1
                      }}
                      inputStyle={{
                        width: '100%',
                        padding: '0.75rem 1rem 0.75rem 3.5rem',
                        border: `1px solid ${
                          error 
                            ? '#ef4444' 
                            : isDarkMode ? '#475569' : '#d1d5db'
                        }`,
                        borderRadius: '12px',
                        backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                        color: isDarkMode ? 'white' : '#1e293b',
                        fontSize: '1rem',
                        height: '48px',
                        transition: 'border-color 0.2s ease, background-color 0.2s ease'
                      }}
                      buttonStyle={{
                        border: 'none',
                        background: 'transparent',
                        paddingLeft: '0.75rem',
                        height: '48px',
                        opacity: loading ? 0.6 : 1
                      }}
                    />
                  </div>

                  {/* Message d'erreur avec animation */}
                  <AnimatePresence>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: 'auto' }}
                        exit={{ opacity: 0, y: -10, height: 0 }}
                        className="flex items-center space-x-2 text-red-500 text-sm"
                      >
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <Separator />

                {/* Actions */}
                <div className="flex flex-col space-y-3">
                  <Button
                    type="submit"
                    disabled={loading || !telephone}
                    className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold transition-all duration-300"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="h-5 w-5 mr-2" />
                        Envoyer le lien
                      </>
                    )}
                  </Button>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={loading}
                    className={`w-full h-12 ${
                      isDarkMode 
                        ? 'border-slate-600 hover:bg-slate-800' 
                        : 'border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    Annuler
                  </Button>
                </div>

                {/* Information complémentaire */}
                <div className={`text-center text-sm ${
                  isDarkMode ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <div className="flex items-center justify-center space-x-2 p-3 rounded-lg bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20">
                    <CheckCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                    <span>
                      Un SMS avec le lien de réinitialisation sera envoyé à ce numéro
                    </span>
                  </div>
                </div>
              </motion.form>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}