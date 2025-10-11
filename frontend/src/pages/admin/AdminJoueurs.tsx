import React, { useEffect, useState } from 'react';
import { adminService, JoueurAdmin } from '../../services/adminService';
import { Search, Eye, Power } from 'lucide-react';

export default function AdminJoueurs() {
  const [joueurs, setJoueurs] = useState<JoueurAdmin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJoueur, setSelectedJoueur] = useState<JoueurAdmin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJoueurs();
  }, []);

  const loadJoueurs = async () => {
    try {
      const response = await adminService.getAllJoueurs();
      setJoueurs(response.data);
    } catch (error) {
      console.error('Erreur chargement joueurs', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadJoueurs();
      return;
    }
    try {
      const response = await adminService.searchJoueurs(searchQuery);
      setJoueurs(response.data);
    } catch (error) {
      console.error('Erreur recherche', error);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await adminService.toggleJoueurStatus(id);
      loadJoueurs();
      if (selectedJoueur?.id === id) {
        const response = await adminService.getJoueurDetails(id);
        setSelectedJoueur(response.data);
      }
    } catch (error) {
      console.error('Erreur toggle status', error);
      alert('Erreur lors du changement de statut');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {/* Liste des joueurs */}
      {!selectedJoueur && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold mb-4">Gestion des Joueurs</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom ou email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prénom</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date inscription</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {joueurs.map((joueur) => (
                  <tr key={joueur.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{joueur.nom}</td>
                    <td className="px-6 py-4">{joueur.prenom}</td>
                    <td className="px-6 py-4">{joueur.email}</td>
                    <td className="px-6 py-4">
                      {joueur.dateInscription ? formatDate(joueur.dateInscription) : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleToggleStatus(joueur.id)}
                          className={`flex items-center gap-1 px-3 py-1 text-sm rounded transition-colors ${
                            joueur.actif
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-red-100 text-red-700 hover:bg-red-200'
                          }`}
                        >
                          <Power size={16} />
                          {joueur.actif ? 'Actif' : 'Inactif'}
                        </button>
                        <button
                          onClick={() => setSelectedJoueur(joueur)}
                          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                        >
                          <Eye size={16} />
                          Profil
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Détail joueur */}
      {selectedJoueur && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <button
              onClick={() => setSelectedJoueur(null)}
              className="text-green-600 hover:text-green-700 mb-4"
            >
              ← Retour à la liste
            </button>
            <h2 className="text-2xl font-bold">
              {selectedJoueur.prenom} {selectedJoueur.nom}
            </h2>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p className="text-base">{selectedJoueur.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Téléphone</p>
                <p className="text-base">{selectedJoueur.telephone || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date d'inscription</p>
                <p className="text-base">
                  {selectedJoueur.dateInscription ? formatDate(selectedJoueur.dateInscription) : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Statut</p>
                <p className={`text-base font-medium ${selectedJoueur.actif ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedJoueur.actif ? 'Compte actif' : 'Compte désactivé'}
                </p>
              </div>
            </div>
            <div className="pt-4">
              <button
                onClick={() => handleToggleStatus(selectedJoueur.id)}
                className={`px-4 py-2 rounded-lg font-medium ${
                  selectedJoueur.actif
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {selectedJoueur.actif ? 'Désactiver le compte' : 'Activer le compte'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}