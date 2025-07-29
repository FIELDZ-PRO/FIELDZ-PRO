import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:8080/api/auth/login', {
        email,
        motDePasse
      });

      const token = res.data.token;
      login(token);

      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === 'CLUB') {
        navigate('/club');
      } else if (role === 'JOUEUR') {
        navigate('/joueur');
      } else {
        setMessage("Rôle utilisateur inconnu.");
        navigate('/');
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message ||
        err.response?.data ||
        "Erreur de connexion"
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 to-white">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm flex flex-col gap-4 border border-green-100"
        style={{ minWidth: 340 }}
      >
        <div className="text-center mb-2">
          <div className="text-3xl mb-2 font-bold tracking-tight text-green-600">🎾 FIELDZ</div>
          <div className="text-xl font-semibold mb-2 text-gray-800">Connexion à votre espace</div>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          autoComplete="username"
          onChange={e => setEmail(e.target.value)}
          className="input-field border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={motDePasse}
          autoComplete="current-password"
          onChange={e => setMotDePasse(e.target.value)}
          className="input-field border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          required
        />
<div className="text-right text-sm">
  <button
    type="button"
    onClick={() => navigate('/forgot-password')}
    className="text-green-600 hover:text-green-800 underline"
  >
    Mot de passe oublié ?
  </button>
</div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white p-2 mt-2 rounded-lg font-semibold hover:bg-green-600 transition disabled:bg-green-300"
          disabled={isLoading}
        >
          {isLoading ? "Connexion..." : "Se connecter"}
        </button>

        {message && (
          <p className="mt-2 text-center text-sm text-red-500">{message}</p>
        )}

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
            Pas de compte ?&nbsp;
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-green-600 underline hover:text-green-800 font-medium"
            >
              S'inscrire
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
