import React, { useEffect, useState } from 'react';
import ApiService from '../../services/ApiService';
import { PROFILE_BASE_URL } from '../../services/ApiService';
import '../../styles/profile.css'; 
function ProfileVendeuse() {
   
        const [user, setUser] = useState(null);
        const [form, setForm] = useState({
          username: '',
          telephone: '',
          localite: '',
          statut: '',
          domaine_activite: '',
          profile: null,
        });
      
        useEffect(() => {
          fetchUser();
        }, []);
      
        const fetchUser = async () => {
          try {
            const response = await ApiService.getprofile(); // GET /user
            const u = response.data.user;
            setUser(u);
            setForm({
              username: u.username || '',
              telephone: u.telephone || '',
              localite: u.localite || '',
              statut: u.statut || 'actif',
              domaine_activite: u.domaine_activite || '',
              profile: null,
            });
          } catch (err) {
            console.error('Erreur chargement profil:', err);
          }
        };
      
        const handleChange = (e) => {
          const { name, value, files } = e.target;
          if (name === 'profile') {
            setForm({ ...form, profile: files[0] });
          } else {
            setForm({ ...form, [name]: value });
          }
        };
      
        const handleSubmit = async (e) => {
          e.preventDefault();
          const data = new FormData();
          for (let key in form) {
            if (form[key]) data.append(key, form[key]);
          }
      
          try {
            await ApiService.updateProfile(data);
            fetchUser(); 
            alert('Profil mis à jour avec succès !');
          } catch (err) {
            console.error('Erreur mise à jour:', err.response?.data || err.message);
          }
        };
      
        return (
          <div className="profile-box">
          {user && (
            <>
              <div className="profile-header">
                <h1 className="username">{user.username}</h1>
        
                <div className="photo-upload-wrapper">
                  <label htmlFor="profile-upload" className="profile-label">
                    <img
                      src={
                        form.profile instanceof File
                          ? URL.createObjectURL(form.profile)
                          : `${PROFILE_BASE_URL}/${user?.profile}`
                      }
                      alt="Profil"
                      className="profile-clickable"
                      title="Cliquez pour changer la photo"
                    />
                    <span className="edit-overlay">📷</span>
                  </label>
                  <input
                    id="profile-upload"
                    type="file"
                    name="profile"
                    accept="image/*"
                    onChange={handleChange}
                    style={{ display: "none" }}
                  />
                </div>
              </div>
        
              <form onSubmit={handleSubmit} encType="multipart/form-data" className="profile-form">
                <div>
                  <label>Nom d'utilisateur</label>
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    required
                  />
                </div>
        
                <div>
                  <label>Téléphone</label>
                  <input
                    type="tel"
                    name="telephone"
                    value={form.telephone}
                    onChange={handleChange}
                    required
                  />
                </div>
        
                <div>
                  <label>Localité</label>
                  <input
                    type="text"
                    name="localite"
                    value={form.localite}
                    onChange={handleChange}
                    required
                  />
                </div>
        
                <div>
                <label>Statut</label>
                <input type="text" name="statut" value={form.statut} readOnly />
              </div>

        
                <div>
                  <label>Domaine d’activité</label>
                  <select className='selectdomaine'
                    name="domaine_activite"
                    value={form.domaine_activite}
                    onChange={handleChange}
                    required
                    style={{ width: '900%' }} 
                  >
                    <option value="">-- Sélectionner --</option>
                    <option value="halieutique">Halieutique</option>
                    <option value="Agroalimentaire">Agroalimentaire</option>
                    <option value="Artisanat local">Artisanat local</option>
                    <option value="Savons / Cosmétiques">Savons / Cosmétiques</option>
                    <option value="Jus locaux">Jus locaux</option>
                  </select>
                </div>
        
                <button type="submit">Enregistrer</button>
              </form>
            </>
          )}
        </div>
        
        );
      }
      
      export default ProfileVendeuse;