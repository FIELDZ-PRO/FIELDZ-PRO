import React, { useEffect, useState } from 'react';
import { adminService, ClubAdmin, CreateClubRequest } from '../../services/adminService';
import { Search, Plus, Eye, X } from 'lucide-react';

export default function AdminClubs() {
  const [clubs, setClubs] = useState<ClubAdmin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedClub, setSelectedClub] = useState<ClubAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");

  const [newClub, setNewClub] = useState<CreateClubRequest>({
    nom: '',
    adresse: '',
    telephone: '',
    sport: '',
    ville: '',
    nomResponsable: '',
    emailResponsable: '',
    telephoneResponsable: '',
  });

  useEffect(() => { loadClubs(); }, []);

  const loadClubs = async () => {
    try {
      const response = await adminService.getAllClubs();
      setClubs(response.data);
      setErr("");
    } catch (error: any) {
      console.error('Erreur chargement clubs', error?.response?.data || error);
      setErr(error?.response?.data?.message || error?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return loadClubs();
    try {
      const response = await adminService.searchClubs(searchQuery);
      setClubs(response.data);
      setErr("");
    } catch (error: any) {
      console.error('Erreur recherche', error?.response?.data || error);
      setErr(error?.response?.data?.message || error?.message || "Erreur recherche");
    }
  };

  const handleCreateClub = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await adminService.createClub(newClub);
      alert(`Club créé !\n\nIdentifiants:\nLogin: ${data.login}\nMot de passe: ${data.password}`);
      setShowCreateForm(false);
      setNewClub({
        nom: '',
        adresse: '',
        telephone: '',
        sport: '',
        ville: '',
        nomResponsable: '',
        emailResponsable: '',
        telephoneResponsable: '',
      });
      loadClubs();
    } catch (error: any) {
      console.error('Erreur création club', error?.response?.data || error);
      alert(error?.response?.data?.message || 'Erreur lors de la création du club');
    }
  };

  if (loading) return <div>Chargement...</div>;
  if (err) return <div className="text-red-600">Erreur: {err}</div>;

  return (
    <div>
      {!selectedClub && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Gestion des Clubs</h2>
              <button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                <Plus size={20} />
                Créer un club
              </button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sport</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ville</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {clubs.map((club) => (
                  <tr key={club.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{club.nom}</td>
                    <td className="px-6 py-4">{club.sport || '—'}</td>
                    <td className="px-6 py-4">{club.ville || '—'}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setSelectedClub(club)}
                        className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                      >
                        <Eye size={16} />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedClub && (
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <button
              onClick={() => setSelectedClub(null)}
              className="text-green-600 hover:text-green-700 mb-4"
            >
              ← Retour à la liste
            </button>
            <h2 className="text-2xl font-bold">{selectedClub.nom}</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Informations générales</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Sport:</span> {selectedClub.sport || '—'}</p>
                  <p><span className="font-medium">Ville:</span> {selectedClub.ville || '—'}</p>
                  <p><span className="font-medium">Email:</span> {selectedClub.emailResponsable || '—'}</p>
                  <p><span className="font-medium">Téléphone:</span> {selectedClub.telephone || '—'}</p>
                  <p><span className="font-medium">Adresse:</span> {selectedClub.adresse || '—'}</p>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-700 mb-3">Responsable</h3>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Nom:</span> {selectedClub.nomResponsable || '—'}</p>
                  <p><span className="font-medium">Email:</span> {selectedClub.emailResponsable || '—'}</p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-gray-700 mb-3">Identifiants de connexion</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm">
                <p><span className="font-medium">Login:</span> {selectedClub.login || '—'}</p>
                <p><span className="font-medium">Mot de passe:</span> {selectedClub.password || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Créer un nouveau club</h2>
              <button onClick={() => setShowCreateForm(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du club *</label>
                  <input
                    type="text"
                    value={newClub.nom}
                    onChange={(e) => setNewClub({ ...newClub, nom: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sport *</label>
                  <input
                    type="text"
                    value={newClub.sport}
                    onChange={(e) => setNewClub({ ...newClub, sport: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
                  <input
                    type="text"
                    value={newClub.ville}
                    onChange={(e) => setNewClub({ ...newClub, ville: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone *</label>
                  <input
                    type="tel"
                    value={newClub.telephone}
                    onChange={(e) => setNewClub({ ...newClub, telephone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse *</label>
                  <input
                    type="text"
                    value={newClub.adresse}
                    onChange={(e) => setNewClub({ ...newClub, adresse: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom du responsable *</label>
                  <input
                    type="text"
                    value={newClub.nomResponsable}
                    onChange={(e) => setNewClub({ ...newClub, nomResponsable: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email du responsable *</label>
                  <input
                    type="email"
                    value={newClub.emailResponsable}
                    onChange={(e) => setNewClub({ ...newClub, emailResponsable: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone responsable *</label>
                  <input
                    type="tel"
                    value={newClub.telephoneResponsable}
                    onChange={(e) => setNewClub({ ...newClub, telephoneResponsable: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Créer le club
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
