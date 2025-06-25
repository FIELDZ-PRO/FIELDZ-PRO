import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ClubDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();         // Supprime le token
    navigate('/');    // Redirige vers la page de connexion
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Bienvenue dans l’espace Club 🎾</h1>

      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default ClubDashboard;
