import './AdminLayout.css';
import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Building2, Users, LogOut } from 'lucide-react';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admin/clubs', icon: Building2, label: 'Clubs' },
    { path: '/admin/joueurs', icon: Users, label: 'Joueurs' }
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/admin':
        return 'Dashboard';
      case '/admin/clubs':
        return 'Gestion des Clubs';
      case '/admin/joueurs':
        return 'Gestion des Joueurs';
      default:
        return 'Administration';
    }
  };

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-sidebar-header">
          <div className="admin-logo">F</div>
          <h1 className="admin-title">Admin Fieldz</h1>
        </div>
        
        <nav className="admin-nav">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="admin-logout">
          <button onClick={handleLogout} className="admin-logout-btn">
            <LogOut size={20} />
            <span>Déconnexion</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        <header className="admin-header">
          <div className="admin-header-inner">
            <h2 className="admin-page-title">{getPageTitle()}</h2>
          </div>
        </header>

        <main className="admin-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;