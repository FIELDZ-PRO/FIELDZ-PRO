import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import "./authcontainer.css";
import "./authform.css";



const Login = () => {
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
const handleSuccess = (credentialResponse) => {
  const tokenId = credentialResponse.credential;

  fetch('http://localhost:8080/oauth2/google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ token: tokenId })
  })
    .then(res => res.json())
    .then(data => {
      const token = data.token;
      login(token);
      const decoded = jwtDecode(token);
      const role = decoded.role;

      if (role === 'CLUB') navigate('/club');
      else if (role === 'JOUEUR') navigate('/joueur');
      else navigate('/');
    })
    .catch(err => {
      console.error("Erreur Google Login :", err);
      setMessage("Erreur lors de la connexion via Google.");
    });
};

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
        navigate('/club2');
      } else if (role === 'JOUEUR') {
        navigate('/joueur2');
      } else {
        setMessage("Rôle utilisateur inconnu.");
        navigate('/');
      }
    } catch (err) {
  const status = err.response?.status;
  const data = err.response?.data;

  if (status === 401) {
    setMessage("❌ Mot de passe incorrect.");
  } else if (status === 423) {
    setMessage("🚫 Compte bloqué temporairement : " + data);
  } else if (status === 404) {
    setMessage("Utilisateur non trouvé.");
  } else {
    setMessage("⚠️ Erreur inattendue : " + (typeof data === 'string' ? data : "Veuillez réessayer plus tard."));
  }
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

<div className="flex flex-col items-center mt-2">
  <p className="text-sm text-gray-500 mb-2">Ou</p>
  <button
    onClick={() => {
      window.location.href = "http://localhost:8080/oauth2/authorization/google";
    }}
    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded"
    disabled={isLoading}
  >
    Se connecter avec Google
  </button>
</div>



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
