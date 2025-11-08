import { useState, useEffect } from 'react';
import { useAuth } from '../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './style/ProfilPage.css';

const ProfilPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState<any>(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/utilisateur/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (err) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [token, navigate]);

  if (!user) return <div className="loading">Chargement du profil...</div>;

  // 🔹 Gestion des changements (texte + fichier)
  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files && files[0]) {
      // Si image → convertir en Base64 (exemple)
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev: any) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  // 🔹 Sauvegarde (PUT vers backend)
  const handleSave = async () => {
    try {
      const res = await fetch('http://localhost:8080/api/utilisateur/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();
      const updatedUser = await res.json();
      setUser(updatedUser);
      setEditMode(false);
      setMessage("✅ Profil mis à jour avec succès.");
      setIsSuccess(true);
    } catch (err) {
      setMessage("❌ Erreur lors de la mise à jour.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="profil-container">
      {/* Bouton retour */}
      <div className="profil-return">
        <button
          onClick={() => navigate(user.role === "CLUB" ? "/club" : "/joueur")}
          className="btn-retour"
        >
          ← Retour au dashboard
        </button>
      </div>

      <div className="profil-card">
        <div className="profil-header">
          <img
            src={formData.photo || "https://via.placeholder.com/150"}
            alt="Photo de profil"
            className="profil-photo"
          />
          {editMode && <input type="file" name="photo" onChange={handleChange} />}
          <h2 className="profil-title">Mon Profil</h2>
        </div>

        <div className="profil-info">
          {editMode ? (
            <>
              <p><strong>Nom :</strong> <input type="text" name="nom" value={formData.nom} onChange={handleChange} /></p>
              <p><strong>Prénom :</strong> <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} /></p>
              <p><strong>Âge :</strong> <input type="number" name="age" value={formData.age || ""} onChange={handleChange} /></p>
              <p><strong>Sport préféré :</strong> <input type="text" name="sport" value={formData.sport || ""} onChange={handleChange} /></p>
              <p><strong>Ville :</strong> <input type="text" name="ville" value={formData.ville || ""} onChange={handleChange} /></p>
              <p><strong>Réseaux sociaux :</strong> <input type="text" name="reseaux" value={formData.reseaux || ""} onChange={handleChange} /></p>
            </>
          ) : (
            <>
              <p><strong>Nom :</strong> {user.nom}</p>
              <p><strong>Prénom :</strong> {user.prenom}</p>
              <p><strong>Âge :</strong> {user.age || "-"}</p>
              <p><strong>Sport préféré :</strong> {user.sport || "-"}</p>
              <p><strong>Ville :</strong> {user.ville || "-"}</p>
              <p><strong>Réseaux sociaux :</strong> {user.reseaux || "-"}</p>
            </>
          )}
        </div>

        <div className="profil-description">
          <h3>Description</h3>
          {editMode ? (
            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
            />
          ) : (
            <p>{user.description || "Aucune description pour le moment."}</p>
          )}
        </div>

        {/* Boutons */}
        <div className="profil-actions">
          {editMode ? (
            <>
              <button onClick={handleSave} className="btn-modifier">✅ Enregistrer</button>
              <button onClick={() => setEditMode(false)} className="btn-retour">❌ Annuler</button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="btn-modifier">✏️ Modifier le profil</button>
          )}
        </div>

        {message && (
          <p className={isSuccess ? "msg-success" : "msg-error"}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default ProfilPage;
