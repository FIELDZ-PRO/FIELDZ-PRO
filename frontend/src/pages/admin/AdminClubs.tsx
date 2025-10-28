import React, { useEffect, useState } from 'react';
import { adminService, ClubAdmin, CreateClubRequest } from '../../services/adminService';
import { Search, Plus, Eye, X, MapPin, Phone, Mail, User } from 'lucide-react';
import '../../components/admin/style/AdminLayout.css';

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

  const colors = [
    { from: '#3b82f6', to: '#2563eb' },
    { from: '#22c55e', to: '#16a34a' },
    { from: '#a855f7', to: '#9333ea' },
    { from: '#f97316', to: '#ea580c' },
    { from: '#ec4899', to: '#db2777' },
    { from: '#6366f1', to: '#4f46e5' }
  ];

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

 const getClubInitials = (nomClub?: string | null) => {
  const s = (nomClub ?? "").trim();
  if (!s) return "CL"; // fallback par défaut
  const parts = s.split(/\s+/);
  const a = parts[0]?.[0] ?? "";
  // si pas de 2e mot : prendre 2e lettre du 1er mot si dispo
  const b = parts[1]?.[0] ?? parts[0]?.[1] ?? "";
  return (a + b).toUpperCase();
};

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (err) {
    return (
      <div style={{ backgroundColor: '#fee2e2', border: '1px solid #fecaca', borderRadius: '0.75rem', padding: '1rem' }}>
        <p style={{ color: '#dc2626' }}>Erreur: {err}</p>
      </div>
    );
  }

  return (
    <div>
      {!selectedClub && (
        <>
          {/* Header avec recherche et bouton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher par nom ou ville..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                className="search-input"
              />
            </div>
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
              <Plus size={20} />
              <span>Créer un club</span>
            </button>
          </div>

          {/* Grille des clubs */}
          <div className="items-grid">
            {clubs.map((club, index) => {
              const color = colors[index % colors.length];
              return (
                <div key={club.id} className="item-card">
                  <div className="item-header">
                    <div className="item-avatar" style={{ '--from': color.from, '--to': color.to } as any}>
                      {getClubInitials(club.nom)}
                    </div>
                    <div className="item-info">
                      <h3 className="item-title">{club.nom}</h3>
                      <span className="item-badge badge-green">{club.sport || '—'}</span>
                    </div>
                  </div>

                  <div className="item-details">
                    <div className="detail-row">
                      <MapPin size={16} />
                      <span>{club.ville || '—'}</span>
                    </div>
                    <div className="detail-row">
                      <User size={16} />
                      <span>{club.nomResponsable || '—'}</span>
                    </div>
                    <div className="detail-row">
                      <Phone size={16} />
                      <span>{club.telephone || '—'}</span>
                    </div>
                  </div>

                  <button onClick={() => setSelectedClub(club)} className="btn btn-view" style={{ width: '100%' }}>
                    <Eye size={18} />
                    <span>Voir détails</span>
                  </button>
                </div>
              );
            })}
          </div>

          {clubs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={32} style={{ color: '#9ca3af' }} />
              </div>
              <h3 className="empty-title">Aucun club trouvé</h3>
              <p className="empty-description">Essayez de modifier votre recherche ou créez un nouveau club.</p>
            </div>
          )}
        </>
      )}

      {/* Modal Détails */}
      {selectedClub && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Détails du club</h2>
              <button onClick={() => setSelectedClub(null)} className="modal-close">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="item-avatar" style={{ '--from': '#22c55e', '--to': '#16a34a', width: '5rem', height: '5rem' } as any}>
                  {getClubInitials(selectedClub.nom)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{selectedClub.nom}</h3>
                  <span className="item-badge badge-green">{selectedClub.sport}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Informations générales</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <MapPin size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Adresse</p>
                        <p style={{ fontWeight: 500 }}>{selectedClub.adresse || '—'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Phone size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Téléphone</p>
                        <p style={{ fontWeight: 500 }}>{selectedClub.telephone || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Responsable</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <User size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Nom</p>
                        <p style={{ fontWeight: 500 }}>{selectedClub.nomResponsable || '—'}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Mail size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email</p>
                        <p style={{ fontWeight: 500 }}>{selectedClub.emailResponsable || '—'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Identifiants de connexion</h4>
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '0.75rem', padding: '1rem' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Login</p>
                    <p style={{ fontFamily: 'monospace', fontWeight: 500, backgroundColor: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                      {selectedClub.login || '—'}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Mot de passe</p>
                    <p style={{ fontFamily: 'monospace', fontWeight: 500, backgroundColor: 'white', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #e5e7eb' }}>
                      {selectedClub.password || '—'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer Club */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Créer un nouveau club</h2>
              <button onClick={() => setShowCreateForm(false)} className="modal-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateClub} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom du club *</label>
                  <input
                    type="text"
                    required
                    value={newClub.nom}
                    onChange={(e) => setNewClub({ ...newClub, nom: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sport *</label>
                  <input
                    type="text"
                    required
                    value={newClub.sport}
                    onChange={(e) => setNewClub({ ...newClub, sport: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Ville *</label>
                  <input
                    type="text"
                    required
                    value={newClub.ville}
                    onChange={(e) => setNewClub({ ...newClub, ville: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Téléphone *</label>
                  <input
                    type="tel"
                    required
                    value={newClub.telephone}
                    onChange={(e) => setNewClub({ ...newClub, telephone: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Adresse *</label>
                <input
                  type="text"
                  required
                  value={newClub.adresse}
                  onChange={(e) => setNewClub({ ...newClub, adresse: e.target.value })}
                  className="form-input"
                />
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem', marginTop: '1.5rem' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Informations du responsable</h3>
                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">Nom du responsable *</label>
                    <input
                      type="text"
                      required
                      value={newClub.nomResponsable}
                      onChange={(e) => setNewClub({ ...newClub, nomResponsable: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Email du responsable *</label>
                    <input
                      type="email"
                      required
                      value={newClub.emailResponsable}
                      onChange={(e) => setNewClub({ ...newClub, emailResponsable: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Téléphone responsable *</label>
                    <input
                      type="tel"
                      required
                      value={newClub.telephoneResponsable}
                      onChange={(e) => setNewClub({ ...newClub, telephoneResponsable: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-cancel">
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
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