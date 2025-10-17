import React, { useEffect, useState } from 'react';
import { adminService, AdminStats } from '../../services/adminService';
import { Users, Building2, Calendar, TrendingUp } from 'lucide-react';
import '../../components/admin/style/AdminLayout.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats', error);
      setError('Impossible de charger les statistiques');
    } finally {
      setLoading(false);
    }
  };

  // Fonction pour formater le pourcentage
  const formatCroissance = (valeur: number | undefined) => {
    if (valeur === undefined || valeur === null) return '0%';
    const signe = valeur >= 0 ? '+' : '';
    return `${signe}${valeur.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: '#fef3c7', border: '1px solid #fde047', borderRadius: '0.75rem', padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ width: '2rem', height: '2rem', backgroundColor: '#fef9c3', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: '0.875rem' }}>⚠</span>
          </div>
          <div>
            <h3 style={{ color: '#854d0e', fontWeight: 600 }}>Erreur de chargement</h3>
            <p style={{ color: '#a16207' }}>{error}</p>
          </div>
        </div>
        <button
          onClick={loadStats}
          style={{ marginTop: '1rem', backgroundColor: '#ca8a04', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', border: 'none', cursor: 'pointer' }}
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Welcome Banner */}
      <div className="dashboard-welcome">
        <h1>Bienvenue sur votre Dashboard</h1>
        <p>Gérez votre plateforme Fieldz en toute simplicité</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {/* Total Clubs */}
        <div className="stat-card blue">
          <div className="stat-card-header">
            <div className="stat-icon blue">
              <Building2 size={24} />
            </div>
            <div className="stat-value">{stats?.totalClubs || 0}</div>
          </div>
          <h3 className="stat-title">Total Clubs</h3>
          {stats?.croissanceClubs !== undefined && (
            <p className="stat-growth">{formatCroissance(stats.croissanceClubs)} ce mois</p>
          )}
        </div>

        {/* Total Joueurs */}
        <div className="stat-card green">
          <div className="stat-card-header">
            <div className="stat-icon green">
              <Users size={24} />
            </div>
            <div className="stat-value">{stats?.totalJoueurs || 0}</div>
          </div>
          <h3 className="stat-title">Total Joueurs</h3>
          {stats?.croissanceJoueurs !== undefined && (
            <p className="stat-growth">{formatCroissance(stats.croissanceJoueurs)} ce mois</p>
          )}
        </div>

        {/* Réservations Hebdomadaires */}
        <div className="stat-card purple">
          <div className="stat-card-header">
            <div className="stat-icon purple">
              <Calendar size={24} />
            </div>
            <div className="stat-value">{stats?.reservationsHebdomadaires || 0}</div>
          </div>
          <h3 className="stat-title">Réservations Hebdomadaires</h3>
        </div>

        {/* Croissance Clubs */}
        <div className="stat-card orange">
          <div className="stat-card-header">
            <div className="stat-icon orange">
              <TrendingUp size={24} />
            </div>
            <div className="stat-value">
              {formatCroissance(stats?.croissanceClubs)}
            </div>
          </div>
          <h3 className="stat-title">Croissance Clubs</h3>
        </div>
      </div>

      {/* Activity Section */}
      <div className="activity-section">
        <h2>Activité Récente</h2>
        <div className="activity-list">
          <div className="activity-item">
            <div className="activity-icon green">
              <Building2 size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">Nouveau club inscrit</p>
              <p className="activity-time">Il y a 2 heures</p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon blue">
              <Users size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">5 nouveaux joueurs inscrits</p>
              <p className="activity-time">Aujourd'hui</p>
            </div>
          </div>

          <div className="activity-item">
            <div className="activity-icon purple">
              <Calendar size={20} />
            </div>
            <div className="activity-content">
              <p className="activity-title">Pic de réservations cette semaine</p>
              <p className="activity-time">+25% par rapport à la semaine dernière</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}