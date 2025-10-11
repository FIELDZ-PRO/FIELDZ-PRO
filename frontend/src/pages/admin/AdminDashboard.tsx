import React, { useEffect, useState } from 'react';
import { adminService, AdminStats } from '../../services/adminService';
import { Users, Building2, Calendar, TrendingUp, Activity } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des stats', error);
    } finally {
      setLoading(false);
    }
  };

  // Données fictives pour les graphiques (à remplacer par de vraies données de l'API)
  const reservationsData = [
    { jour: 'Lun', nombre: 12 },
    { jour: 'Mar', nombre: 19 },
    { jour: 'Mer', nombre: 8 },
    { jour: 'Jeu', nombre: 15 },
    { jour: 'Ven', nombre: 22 },
    { jour: 'Sam', nombre: 28 },
    { jour: 'Dim', nombre: 18 },
  ];

  const sportsData = [
    { name: 'Football', value: 45, color: '#10b981' },
    { name: 'Tennis', value: 25, color: '#3b82f6' },
    { name: 'Basket', value: 20, color: '#f59e0b' },
    { name: 'Autres', value: 10, color: '#8b5cf6' },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin</h1>
        <p className="text-gray-600 mt-1">Vue d'ensemble de votre plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Clubs */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-medium">Total Clubs</p>
              <p className="text-4xl font-bold mt-2">{stats?.totalClubs || 0}</p>
              <p className="text-green-100 text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                +12% ce mois
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Building2 size={32} />
            </div>
          </div>
        </div>

        {/* Total Joueurs */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Joueurs</p>
              <p className="text-4xl font-bold mt-2">{stats?.totalJoueurs || 0}</p>
              <p className="text-blue-100 text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                +8% ce mois
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Users size={32} />
            </div>
          </div>
        </div>

        {/* Réservations hebdo */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-medium">Réservations hebdo</p>
              <p className="text-4xl font-bold mt-2">{stats?.reservationsHebdomadaires || 0}</p>
              <p className="text-purple-100 text-xs mt-2 flex items-center gap-1">
                <TrendingUp size={14} />
                +15% ce mois
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Calendar size={32} />
            </div>
          </div>
        </div>

        {/* Taux d'occupation */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-transform duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm font-medium">Taux d'occupation</p>
              <p className="text-4xl font-bold mt-2">78%</p>
              <p className="text-orange-100 text-xs mt-2 flex items-center gap-1">
                <Activity size={14} />
                Excellent
              </p>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-4">
              <Activity size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Réservations par jour */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Réservations cette semaine</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reservationsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="jour" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}
              />
              <Bar dataKey="nombre" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Répartition par sport */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Répartition par sport</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={sportsData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sportsData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {sportsData.map((sport, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sport.color }}></div>
                  <span className="text-gray-700">{sport.name}</span>
                </div>
                <span className="font-semibold text-gray-900">{sport.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activité récente */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Activité récente</h2>
        <div className="space-y-4">
          {[
            { action: 'Nouveau club inscrit', detail: 'FC Barcelona - Football', time: 'Il y a 5 min', color: 'green' },
            { action: 'Nouvelle réservation', detail: 'Terrain A - 14h00', time: 'Il y a 12 min', color: 'blue' },
            { action: 'Nouvel utilisateur', detail: 'Pierre Martin', time: 'Il y a 23 min', color: 'purple' },
            { action: 'Réservation annulée', detail: 'Court 2 - 16h00', time: 'Il y a 1h', color: 'orange' },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-2 h-2 rounded-full bg-${item.color}-500`}></div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">{item.action}</p>
                <p className="text-sm text-gray-600">{item.detail}</p>
              </div>
              <span className="text-xs text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}