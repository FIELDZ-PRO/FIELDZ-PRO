import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../shared/context/AuthContext';

type HeaderClubProps = {
  nomClub: string | null;
};

const HeaderClub: React.FC<HeaderClubProps> = ({ nomClub }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-green-600 flex items-center gap-2">
          🎾 FIELDZ Club
          {nomClub && (
            <span className="text-blue-600 text-xl font-semibold">| {nomClub}</span>
          )}
        </h1>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => navigate('/profil')}
          className="bg-violet-600 text-white px-3 py-1 rounded hover:bg-violet-700 transition"
        >
          👤 Mon profil
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
        >
          🔌 Déconnexion
        </button>
      </div>
    </header>
  );
};

export default HeaderClub;
