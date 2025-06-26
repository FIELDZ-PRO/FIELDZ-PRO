import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'JOUEUR', // ou 'CLUB'
  });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', formData);
      console.log("✅ Inscription réussie :", res.data);
      alert("Compte créé avec succès !");
      navigate('/');
    } catch (err) {
      console.error("❌ Erreur d'inscription :", err.response?.data || err.message);
      setMessage("Erreur lors de l'inscription.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleRegister} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Créer un compte</h2>

        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
          className="w-full border p-2 mb-2 rounded"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full border p-2 mb-4 rounded"
        >
          <option value="JOUEUR">Joueur</option>
          <option value="CLUB">Club</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          S'inscrire
        </button>

        {message && (
          <p className="mt-3 text-center text-sm text-red-500">{message}</p>
        )}
      </form>
    </div>
  );
};

export default Register;
