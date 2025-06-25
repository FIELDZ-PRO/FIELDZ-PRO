import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const JoueurDashboard = () => {
  const { logout, role } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="p-4 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-4">Bienvenue Joueur 🎮</h1>
      <p>Rôle connecté : <strong>{role}</strong></p>
      <button
        onClick={handleLogout}
        className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
      >
        Se déconnecter
      </button>
    </div>
  );
};

export default JoueurDashboard;
