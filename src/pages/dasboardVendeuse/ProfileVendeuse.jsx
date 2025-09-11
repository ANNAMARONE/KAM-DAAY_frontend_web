import React, { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { 
  User, 
  Phone, 
  MapPin, 
  Upload, 
  Camera, 
  Save, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  Building,
  Calendar,
  Mail,
  Shield
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
import { Separator } from '../../components/ui/separator'
import ApiService from '../../services/ApiService';
import { PROFILE_BASE_URL } from '../../services/ApiService';
import Swal from 'sweetalert2'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

function ProfileVendeuse() {
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({
    username: '',
    telephone: '',
    localite: '',
    statut: '',
    domaine_activite: '',
    profile: null,
  })
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(true)

  // Gestion du thème
  useEffect(() => {
    const darkMode = document.documentElement.classList.contains('dark')
    setIsDarkMode(darkMode)
  }, [])

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    setLoading(true)
    try {
      const response = await ApiService.getprofile()
      const u = response.data.user
      setUser(u)
      setForm({
        username: u.username || '',
        telephone: u.telephone || '',
        localite: u.localite || '',
        statut: u.statut || 'actif',
        domaine_activite: u.domaine_activite || '',
        profile: null,
      })
    } catch (err) {
      console.error('Erreur chargement profil:', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Impossible de charger le profil'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'profile') {
      setForm({ ...form, profile: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.username || !form.telephone || !form.localite || !form.domaine_activite) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs obligatoires.'
      })
      return
    }

    setSaving(true)

    try {
      const data = new FormData()
      Object.keys(form).forEach(key => {
        const value = form[key]
        if (value) {
          data.append(key, value)
        }
      })

      await ApiService.updateProfile(data)
      await fetchUser()
      
      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Profil mis à jour avec succès!'
      })
    } catch (err) {
      console.error('Erreur mise à jour:', err)
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: 'Une erreur est survenue lors de la mise à jour'
      })
    } finally {
      setSaving(false)
    }
  }

  const getStatutBadgeColor = (statut) => {
    switch (statut?.toLowerCase()) {
      case 'actif': return 'bg-emerald-500'
      case 'inactif': return 'bg-red-500'
      case 'suspendu': return 'bg-yellow-500'
      default: return 'bg-slate-500'
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifié'
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

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
            Chargement du profil...
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
      <div className="container mx-auto p-6 space-y-8 max-w-4xl">
        {/* En-tête */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="flex items-center justify-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <User className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className={`text-4xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Mon Profil
              </h1>
              <p className={`text-lg ${
                isDarkMode ? 'text-purple-300' : 'text-indigo-600'
              }`}>
                Gérez vos informations personnelles
              </p>
            </div>
          </div>
        </motion.div>

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Colonne de gauche - Informations générales */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Photo et informations de base */}
              <Card className={`border-purple-500/20 ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-slate-700/50' 
                  : 'bg-white/90 border-slate-200/50'
              } backdrop-blur-md`}>
                <CardContent className="p-6 text-center space-y-6">
                  {/* Photo de profil */}
                  <div className="relative mx-auto w-32 h-32">
                    <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-gradient-to-r from-purple-600 to-pink-600 p-1">
                      <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800">
                        <img
                          src={
                            form.profile instanceof File
                              ? URL.createObjectURL(form.profile)
                              : user.profile 
                                ? `${PROFILE_BASE_URL}/${user.profile}`
                                : 'https://images.unsplash.com/photo-1494790108755-2616b612b786?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHByb2ZpbGV8ZW58MXx8fHwxNzU3NDY3NzI4fDA&ixlib=rb-4.1.0&q=80&w=1080'
                          }
                          alt="Photo de profil"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <label className="absolute bottom-0 right-0 p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full cursor-pointer hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg">
                      <Camera className="h-4 w-4 text-white" />
                      <input
                        type="file"
                        name="profile"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                      />
                    </label>
                  </div>

                  {/* Nom d'utilisateur et statut */}
                  <div className="space-y-3">
                    <h2 className={`text-2xl font-bold ${
                      isDarkMode ? 'text-white' : 'text-slate-800'
                    }`}>
                      @{user.username}
                    </h2>
                    <Badge className={`${getStatutBadgeColor(user.statut)} text-white`}>
                      {user.statut}
                    </Badge>
                  </div>

                  <Separator />

                  {/* Informations additionnelles */}
                  <div className="space-y-4 text-left">
                    {user.email && (
                      <div className="flex items-center space-x-3">
                        <Mail className={`h-4 w-4 ${
                          isDarkMode ? 'text-purple-400' : 'text-purple-600'
                        }`} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          {user.email}
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-3">
                      <Building className={`h-4 w-4 ${
                        isDarkMode ? 'text-emerald-400' : 'text-emerald-600'
                      }`} />
                      <span className={`text-sm ${
                        isDarkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}>
                        {user.domaine_activite}
                      </span>
                    </div>

                    {user.date_creation && (
                      <div className="flex items-center space-x-3">
                        <Calendar className={`h-4 w-4 ${
                          isDarkMode ? 'text-blue-400' : 'text-blue-600'
                        }`} />
                        <span className={`text-sm ${
                          isDarkMode ? 'text-slate-300' : 'text-slate-600'
                        }`}>
                          Inscrit depuis {formatDate(user.date_creation)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Colonne de droite - Formulaire */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className={`border-purple-500/20 ${
                isDarkMode 
                  ? 'bg-slate-900/90 border-slate-700/50' 
                  : 'bg-white/90 border-slate-200/50'
              } backdrop-blur-md`}>
                <CardHeader>
                  <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    Modifier les informations
                  </CardTitle>
                  <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    Mettez à jour vos informations personnelles
                  </p>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Nom d'utilisateur */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="space-y-2"
                    >
                      <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Nom d'utilisateur *
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          name="username"
                          value={form.username}
                          onChange={handleChange}
                          placeholder="Votre nom d'utilisateur"
                          className={`pl-10 ${
                            isDarkMode 
                              ? 'bg-slate-800/50 border-slate-600' 
                              : 'bg-white/50 border-slate-300'
                          }`}
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Téléphone */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="space-y-2"
                    >
                      <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Téléphone *
                      </Label>
                      <PhoneInput
                        country={'sn'}
                        value={form.telephone}
                        onChange={(phone) => setForm({ ...form, telephone: phone })}
                        containerStyle={{
                          width: '100%',
                          border: `1px solid ${isDarkMode ? '#475569' : '#cbd5e1'}`,
                          borderRadius: '12px',
                          backgroundColor: isDarkMode ? 'rgba(51, 65, 85, 0.5)' : 'rgba(255, 255, 255, 0.5)',
                          transition: 'border-color 0.2s ease, background-color 0.2s ease'
                        }}
                        inputStyle={{
                          width: '100%',
                          padding: '0.75rem 1rem 0.75rem 3.5rem',
                          border: 'none',
                          borderRadius: '12px',
                          backgroundColor: 'transparent',
                          color: isDarkMode ? 'white' : '#1e293b'
                        }}
                        buttonStyle={{
                          border: 'none',
                          background: 'transparent',
                          paddingLeft: '0.75rem'
                        }}
                        placeholder="Numéro de téléphone"
                      />
                    </motion.div>

                    {/* Localité */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="space-y-2"
                    >
                      <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Localité *
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          name="localite"
                          value={form.localite}
                          onChange={handleChange}
                          placeholder="Votre ville/région"
                          className={`pl-10 ${
                            isDarkMode 
                              ? 'bg-slate-800/50 border-slate-600' 
                              : 'bg-white/50 border-slate-300'
                          }`}
                          required
                        />
                      </div>
                    </motion.div>

                    {/* Statut (lecture seule) */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="space-y-2"
                    >
                      <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Statut
                      </Label>
                      <div className="relative">
                        <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-500" />
                        <Input
                          name="statut"
                          value={form.statut}
                          className={`pl-10 ${
                            isDarkMode 
                              ? 'bg-slate-800/30 border-slate-600/50' 
                              : 'bg-slate-100/50 border-slate-300/50'
                          }`}
                          disabled
                        />
                      </div>
                    </motion.div>

                    {/* Domaine d'activité */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="space-y-2"
                    >
                      <Label className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        Domaine d'activité *
                      </Label>
                      <Select 
                        value={form.domaine_activite} 
                        onValueChange={(value) => setForm({ ...form, domaine_activite: value })}
                      >
                        <SelectTrigger className={`${
                          isDarkMode 
                            ? 'bg-slate-800/50 border-slate-600' 
                            : 'bg-white/50 border-slate-300'
                        }`}>
                          <Building className="h-4 w-4 mr-2 text-slate-500" />
                          <SelectValue placeholder="-- Sélectionner --" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="halieutique">Halieutique</SelectItem>
                          <SelectItem value="Agroalimentaire">Agroalimentaire</SelectItem>
                          <SelectItem value="Artisanat local">Artisanat local</SelectItem>
                          <SelectItem value="Savons / Cosmétiques">Savons / Cosmétiques</SelectItem>
                          <SelectItem value="Jus locaux">Jus locaux</SelectItem>
                          <SelectItem value="Textile">Textile</SelectItem>
                          <SelectItem value="Technologie">Technologie</SelectItem>
                          <SelectItem value="Commerce général">Commerce général</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    {/* Bouton de sauvegarde */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="pt-4"
                    >
                      <Button
                        type="submit"
                        disabled={saving}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-3"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                            Sauvegarde en cours...
                          </>
                        ) : (
                          <>
                            <Save className="h-5 w-5 mr-2" />
                            Sauvegarder les modifications
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileVendeuse
