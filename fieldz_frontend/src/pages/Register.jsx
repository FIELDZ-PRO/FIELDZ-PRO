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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');
    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', formData);
      alert("Compte créé avec succès !");
      navigate('/');
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data ||
        "Erreur lors de l'inscription."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
      <form
        onSubmit={handleRegister}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-4 border border-blue-100"
        style={{ minWidth: 340 }}
      >
        <div className="text-center mb-2">
          <div className="text-3xl mb-2 font-bold tracking-tight text-blue-600">🎾 FIELDZ</div>
          <div className="text-xl font-semibold mb-2 text-gray-800">Créer un compte</div>
        </div>
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          className="input-field border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <input
          type="password"
          name="motDePasse"
          placeholder="Mot de passe"
          value={formData.motDePasse}
          onChange={handleChange}
          className="input-field border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          required
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="input-field border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="JOUEUR">Joueur</option>
          <option value="CLUB">Club</option>
        </select>

        <button
          type="submit"
          className="w-full bg-green-600 text-white p-2 mt-2 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-green-300"
          disabled={isLoading}
        >
          {isLoading ? "Inscription..." : "S'inscrire"}
        </button>

        {message && (
          <p className="mt-2 text-center text-sm text-red-500">{message}</p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Déjà un compte ?&nbsp;
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-blue-500 underline hover:text-blue-700 font-medium"
            >
              Se connecter
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Register;
