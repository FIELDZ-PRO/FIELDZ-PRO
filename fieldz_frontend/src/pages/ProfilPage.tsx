import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProfilPage = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    telephone: '',
    adresse: ''
  });
  const [editMode, setEditMode] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/utilisateur/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUser(data);
        setFormData({
          nom: data.nom || data.nomClub || '',
          prenom: data.prenom || '',
          telephone: data.telephone || '',
          adresse: data.adresse || ''
        });
      } catch (err) {
        navigate('/login');
      }
    };

    fetchUser();
  }, [token, navigate]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsSuccess(false);

    try {
      const res = await fetch('http://localhost:8080/api/utilisateur/update', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error();
      setMessage('✅ Profil mis à jour avec succès.');
      setIsSuccess(true);
      setEditMode(false);
    } catch (err) {
      setMessage('❌ Une erreur est survenue lors de la mise à jour.');
      setIsSuccess(false);
    }
  };

  if (!user) return <div className="p-8 text-center">Chargement du profil...</div>;

  const isJoueur = user.role === 'JOUEUR';

  return (
    
    
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="absolute top-6 left-6">
  <button
    onClick={() => navigate(user.role === "CLUB" ? "/club" : "/joueur")}
    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
  >
    ← Retour au dashboard
  </button>
</div>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded-xl w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center text-green-700">👤 Mon Profil</h2>

        {/* Champ Nom ou Nom du Club */}
        {editMode ? (
          <input
            type="text"
            name="nom"
            placeholder={isJoueur ? "Nom" : "Nom du club"}
            value={formData.nom}
            onChange={handleChange}
            className="border rounded px-3 py-2"
            required
          />
        ) : (
          <div><strong>{isJoueur ? "Nom" : "Nom du club"} :</strong> {formData.nom}</div>
        )}

        {/* Prénom */}
        {isJoueur &&
          (editMode ? (
            <input
              type="text"
              name="prenom"
              placeholder="Prénom"
              value={formData.prenom}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          ) : (
            <div><strong>Prénom :</strong> {formData.prenom || "-"}</div>
          ))}

        {/* Téléphone */}
        {editMode ? (
          <input
            type="tel"
            name="telephone"
            placeholder="Téléphone"
            value={formData.telephone}
            onChange={handleChange}
            className="border rounded px-3 py-2"
          />
        ) : (
          <div><strong>Téléphone :</strong> {formData.telephone || "-"}</div>
        )}

        {/* Adresse */}
        {!isJoueur &&
          (editMode ? (
            <input
              type="text"
              name="adresse"
              placeholder="Adresse du club"
              value={formData.adresse}
              onChange={handleChange}
              className="border rounded px-3 py-2"
            />
          ) : (
            <div><strong>Adresse :</strong> {formData.adresse || "-"}</div>
          ))}

        {/* Boutons */}
        {editMode ? (
          <div className="flex gap-4">
            <button
              type="submit"
              className="bg-green-600 text-white flex-1 py-2 rounded hover:bg-green-700"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={() => {
                setEditMode(false);
                setMessage('');
              }}
              className="bg-gray-300 text-gray-800 flex-1 py-2 rounded hover:bg-gray-400"
            >
              Annuler
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setEditMode(true)}
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Modifier le profil
          </button>
        )}

        {message && (
          <p className={`text-center text-sm ${isSuccess ? "text-green-600" : "text-red-500"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default ProfilPage;
