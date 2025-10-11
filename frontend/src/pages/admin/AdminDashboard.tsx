import React, { useEffect, useState } from 'react';
import { adminService, AdminStats } from '../../services/adminService';
import { Users, Building2, Calendar } from 'lucide-react';

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

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Clubs</p>
            <p className="text-3xl font-bold text-green-600">{stats?.totalClubs || 0}</p>
          </div>
          <Building2 size={40} className="text-green-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Total Joueurs</p>
            <p className="text-3xl font-bold text-blue-600">{stats?.totalJoueurs || 0}</p>
          </div>
          <Users size={40} className="text-blue-600 opacity-20" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-600 text-sm">Réservations hebdo</p>
            <p className="text-3xl font-bold text-purple-600">
              {stats?.reservationsHebdomadaires || 0}
            </p>
          </div>
          <Calendar size={40} className="text-purple-600 opacity-20" />
        </div>
      </div>
    </div>
  );
}