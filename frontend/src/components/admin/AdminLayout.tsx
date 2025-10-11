import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-green-600">Admin Fieldz</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
          >
            Déconnexion
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Navigation */}
        <nav className="flex gap-4 mb-6">
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive('/admin')
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Dashboard
          </Link>
          <Link
            to="/admin/clubs"
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive('/admin/clubs')
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Clubs
          </Link>
          <Link
            to="/admin/joueurs"
            className={`px-4 py-2 rounded-lg font-medium ${
              isActive('/admin/joueurs')
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Joueurs
          </Link>
        </nav>

        {/* Contenu */}
        <Outlet />
      </div>
    </div>
  );
}