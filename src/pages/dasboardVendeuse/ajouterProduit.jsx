import React, { useState } from 'react'
import { motion } from 'motion/react'
import { X, Upload, Package, Loader2 } from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import ApiService from '../../services/ApiService'
import Swal from 'sweetalert2'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select'
function AjouterProduits({ onClose }) {
  const [formData, setFormData] = useState({
    nom: '',
    image: null,
    prix_unitaire: '',
    stock: '',
    unite: 'kg',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      setFormData({ ...formData, image: e.target.files[0] })
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.nom || !formData.prix_unitaire || !formData.stock) {
      Swal.fire({
        icon: 'warning',
        title: 'Champs requis',
        text: 'Veuillez remplir tous les champs obligatoires.'
      })
      return
    }

    const data = new FormData()
    data.append('nom', formData.nom)
    data.append('prix_unitaire', Number(formData.prix_unitaire))
    data.append('stock', Number(formData.stock))
    data.append('unite', formData.unite)
    if (formData.image) {
      data.append('image', formData.image)
    }

    setLoading(true)
    try {
      const response = await ApiService.addProduit(data)

      setErrors({})
      setFormData({
        nom: '',
        image: null,
        prix_unitaire: '',
        stock: '',
        unite: 'kg',
      })
      onClose()

      Swal.fire({
        icon: 'success',
        title: 'Succès',
        text: 'Produit ajouté avec succès !',
        timer: 2000,
        showConfirmButton: false
      })

      console.log('Produit ajouté avec succès:', response.data)
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error)

      if (error.response && error.response.data.errors) {
        setErrors(error.response.data.errors)

        const messages = Object.values(error.response.data.errors)
          .flat()
          .join('<br/>')

        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          html: messages
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Erreur',
          text: 'Échec de l’ajout du produit.'
        })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-2xl mx-auto"
    >
      <Card className="border-purple-500/20 bg-white/95 backdrop-blur-md shadow-2xl">
        <CardHeader className="relative">
          <Button
            variant="outline"
            size="icon"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full border-gray-300"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600">
              <Package className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Ajouter un Produit
              </CardTitle>
              <p className="text-gray-600">
                Enrichissez votre catalogue avec un nouveau produit
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-2">
              <Label className="text-gray-700">Image du produit</Label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="border-2 border-dashed border-purple-300 rounded-xl p-8 text-center hover:border-purple-500 transition-colors duration-300">
                  <Upload className="h-12 w-12 text-purple-500 mx-auto mb-4" />
                  <p className="text-gray-600">
                    {formData.image ? formData.image.name : "Cliquez pour ajouter une image"}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="space-y-2">
              <Label className="text-gray-700">Nom du produit</Label>
              <Input
                name="nom"
                placeholder="Ex: iPhone 15 Pro"
                value={formData.nom}
                onChange={handleChange}
                className="border-gray-300 bg-white/50"
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-2">
                <Label className="text-gray-700">Prix unitaire (FCFA)</Label>
                <Input
                  type="number"
                  name="prix_unitaire"
                  placeholder="50000"
                  value={formData.prix_unitaire}
                  onChange={handleChange}
                  className="border-gray-300 bg-white/50"
                />
              </motion.div>
              <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.4 }}
  className="space-y-2"
>
  <Label className="text-gray-700">Unité *</Label>

  <Select
    value={formData.unite}
    onValueChange={(value) => setFormData({ ...formData, unite: value })}
  >
    <SelectTrigger className="w-full bg-white/50 border border-gray-300">
      <SelectValue placeholder="Ex: pièce, kg, litre" />
    </SelectTrigger>

    <SelectContent className="bg-white/80 backdrop-blur-md text-gray-800 border border-gray-300 shadow-lg">
    <SelectItem value="kg">Kilogramme</SelectItem>
    <SelectItem value="litre">Litre</SelectItem>
    <SelectItem value="unite">Unité</SelectItem>
    </SelectContent>
  </Select>
</motion.div>

            </div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="space-y-2">
              <Label className="text-gray-700">Stock disponible</Label>
              <Input
                type="number"
                name="stock"
                placeholder="100"
                value={formData.stock}
                onChange={handleChange}
                className="border-gray-300 bg-white/50"
              />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex space-x-4 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-300" disabled={loading}>
                Annuler
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Ajout en cours...
                  </>
                ) : (
                  'Ajouter le Produit'
                )}
              </Button>
            </motion.div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default AjouterProduits
