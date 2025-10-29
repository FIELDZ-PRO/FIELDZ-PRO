import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import "./style/completeProfile.css"
const CompleteProfile = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [telephone, setTelephone] = useState('');
  const [message, setMessage] = useState('');
  const [isCheckingProfile, setIsCheckingProfile] = useState(true); // ✅ loader initial

  // ✅ Vérifie l’état du profil
  useEffect(() => {
    fetch('http://localhost:8080/api/utilisateur/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(user => {
        if (user.profilComplet) {
          navigate('/joueur');
        } else {
          setIsCheckingProfile(false); // profil incomplet, on affiche le formulaire
        }
      })
      .catch(err => {
        console.error("Erreur profil :", err);
        navigate('/login');
      });
  }, [token, navigate]);

  

  const handleSubmit = async (e) => {
  e.preventDefault();
  setMessage('');

  try {
    // 🔁 Envoie la mise à jour du profil
    const response = await fetch('http://localhost:8080/api/utilisateur/complete-profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ nom, prenom, telephone })
    });

    if (!response.ok) throw new Error("Erreur lors de la mise à jour du profil.");

    // ✅ Recharge les données utilisateur à jour
    const res = await fetch('http://localhost:8080/api/utilisateur/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    const updatedUser = await res.json();
    console.log("✅ Profil rechargé :", updatedUser);

    if (updatedUser.profilComplet) {
      navigate('/joueur');
    } else {
      setMessage("⚠️ Profil toujours incomplet. Réessayez.");
    }

  } catch (error) {
    console.error("Erreur :", error);
    setMessage("❌ Une erreur est survenue.");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4 border border-green-200"
        style={{ minWidth: 340 }}
      >
        <div className="text-center mb-2">
          <div className="text-3xl mb-2 font-bold text-green-600">🎾 FIELDZ</div>
          <div className="text-xl font-semibold text-gray-800">Complétez votre profil</div>
        </div>

        <input
          type="text"
          placeholder="Nom"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <input
          type="text"
          placeholder="Prénom"
          value={prenom}
          onChange={(e) => setPrenom(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <input
          type="tel"
          placeholder="Téléphone"
          value={telephone}
          onChange={(e) => setTelephone(e.target.value)}
          className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />

        <button
          type="submit"
          className="bg-green-500 text-white p-2 rounded-lg font-semibold hover:bg-green-600 transition"
        >
          Valider
        </button>

        {message && <p className="text-center text-red-500 text-sm">{message}</p>}
      </form>
    </div>
  );
};

export default CompleteProfile;
