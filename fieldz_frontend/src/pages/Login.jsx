import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        motDePasse
      });

      const token = res.data.token;
      console.log("✅ Token reçu :", token);

      login(token); // stocke le token dans le contexte

      const decoded = jwtDecode(token);
      const role = decoded.role;
      console.log("👤 Rôle décodé :", role);

      if (role === 'CLUB') {
        navigate('/club');
      } else if (role === 'JOUEUR') {
        navigate('/joueur');
      } else {
        console.warn("Rôle inconnu :", role);
        navigate('/');
      }

    } catch (err) {
      console.error("❌ Erreur de login :", err.response?.data || err.message);
      setMessage("Erreur de connexion");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md w-80">
        <h2 className="text-lg font-bold mb-4 text-center">Connexion</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          onChange={e => setMotDePasse(e.target.value)}
          className="w-full border p-2 mb-2 rounded"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Se connecter
        </button>
        {message && <p className="mt-3 text-center text-sm text-red-500">{message}</p>}
      </form>
    </div>
  );
};

export default Login;
