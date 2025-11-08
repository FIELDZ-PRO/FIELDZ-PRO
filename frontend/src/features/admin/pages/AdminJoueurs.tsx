import React, { useEffect, useState } from 'react';
import { adminService, JoueurAdmin, RegisterRequest } from '../services/adminService';
import { Search, Plus, Eye, X, User, Mail, Phone, Calendar, ToggleLeft, ToggleRight } from 'lucide-react';
import '../components/AdminLayout.css';

export default function AdminJoueurs() {
  const [joueurs, setJoueurs] = useState<JoueurAdmin[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedJoueur, setSelectedJoueur] = useState<JoueurAdmin | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string>("");
  const [toggleLoading, setToggleLoading] = useState<number | null>(null);

  const [newJoueur, setNewJoueur] = useState({
    nom: '',
    email: '',
    motDePasse: '',
    role: 'JOUEUR',
  });

  const colors = [
    { from: '#3b82f6', to: '#2563eb' },
    { from: '#22c55e', to: '#16a34a' },
    { from: '#a855f7', to: '#9333ea' },
    { from: '#f97316', to: '#ea580c' },
    { from: '#ec4899', to: '#db2777' },
    { from: '#6366f1', to: '#4f46e5' },
    { from: '#14b8a6', to: '#0d9488' },
    { from: '#f59e0b', to: '#d97706' }
  ];

  useEffect(() => { loadJoueurs(); }, []);

  const loadJoueurs = async () => {
    try {
      const response = await adminService.getAllJoueurs();
      setJoueurs(response.data);
      setErr("");
    } catch (error: any) {
      console.error('Erreur chargement joueurs', error?.response?.data || error);
      setErr(error?.response?.data?.message || error?.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return loadJoueurs();
    try {
      const response = await adminService.searchJoueurs(searchQuery);
      setJoueurs(response.data);
      setErr("");
    } catch (error: any) {
      console.error('Erreur recherche', error?.response?.data || error);
      setErr(error?.response?.data?.message || error?.message || "Erreur recherche");
    }
  };

  const handleCreateJoueur = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminService.createJoueur(newJoueur);
      alert(`Joueur créé avec succès !\n\nEmail: ${newJoueur.email}`);
      setShowCreateForm(false);
      setNewJoueur({
        nom: '',
        email: '',
        motDePasse: '',
        role: 'JOUEUR',
      });
      await loadJoueurs();
    } catch (error: any) {
      console.error('Erreur création joueur', error?.response?.data || error);
      alert(error?.response?.data?.message || error?.response?.data || 'Erreur lors de la création du joueur');
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setToggleLoading(id);
      await adminService.toggleJoueurStatus(id);
      await loadJoueurs();
      if (selectedJoueur?.id === id) {
        const response = await adminService.getJoueurDetails(id);
        setSelectedJoueur(response.data);
      }
    } catch (error: any) {
      console.error('Erreur toggle status', error?.response?.data || error);
      alert(error?.response?.data?.message || 'Erreur lors du changement de statut');
    } finally {
      setToggleLoading(null);
    }
  };

  const getJoueurInitials = (nom: string, prenom?: string) => {
    if (!prenom) return nom.substring(0, 2).toUpperCase();
    return `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase();
  };

  const formatDate = (dateString?: string) =>
    dateString ? new Date(dateString).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }) : 'N/A';

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
      {!selectedJoueur && (
        <>
          {/* Header avec recherche et bouton */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', gap: '1rem', flexWrap: 'wrap' }}>
            <div className="search-bar">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                placeholder="Rechercher un joueur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyUp={handleSearch}
                className="search-input"
              />
            </div>
            <button onClick={() => setShowCreateForm(true)} className="btn btn-primary">
              <Plus size={20} />
              <span>Créer un joueur</span>
            </button>
          </div>

          {/* Grille des joueurs */}
          <div className="items-grid">
            {joueurs.map((joueur, index) => {
              const color = colors[index % colors.length];
              return (
                <div key={joueur.id} className="item-card">
                  <div className="item-header">
                    <div className="item-avatar" style={{ '--from': color.from, '--to': color.to } as any}>
                      {getJoueurInitials(joueur.nom, joueur.prenom)}
                    </div>
                    <div className="item-info">
                      <h3 className="item-title">{joueur.prenom} {joueur.nom}</h3>
                      <span className={`item-badge ${joueur.actif ? 'badge-green' : 'badge-red'}`}>
                        {joueur.actif ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                  </div>

                  <div className="item-details">
                    <div className="detail-row">
                      <Mail size={16} />
                      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{joueur.email}</span>
                    </div>
                    <div className="detail-row">
                      <Phone size={16} />
                      <span>{joueur.telephone || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <Calendar size={16} />
                      <span style={{ fontSize: '0.75rem' }}>Inscrit le {formatDate(joueur.dateInscription)}</span>
                    </div>
                  </div>

                  <div className="item-actions">
                    <button onClick={() => setSelectedJoueur(joueur)} className="btn btn-view">
                      <Eye size={16} />
                      <span>Détails</span>
                    </button>

                    <button
                      onClick={() => handleToggleStatus(joueur.id)}
                      disabled={toggleLoading === joueur.id}
                      className={`btn ${joueur.actif ? 'btn-toggle-active' : 'btn-toggle-inactive'}`}
                      style={{ opacity: toggleLoading === joueur.id ? 0.5 : 1 }}
                    >
                      {toggleLoading === joueur.id ? (
                        <div className="spinner" style={{ width: '1rem', height: '1rem' }}></div>
                      ) : joueur.actif ? (
                        <ToggleRight size={16} />
                      ) : (
                        <ToggleLeft size={16} />
                      )}
                      <span style={{ fontSize: '0.75rem' }}>{joueur.actif ? 'Désactiver' : 'Activer'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {joueurs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={32} style={{ color: '#9ca3af' }} />
              </div>
              <h3 className="empty-title">Aucun joueur trouvé</h3>
              <p className="empty-description">Essayez de modifier votre recherche ou créez un nouveau joueur.</p>
            </div>
          )}
        </>
      )}

      {/* Modal Détails Joueur */}
      {selectedJoueur && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Détails du joueur</h2>
              <button onClick={() => setSelectedJoueur(null)} className="modal-close">
                <X size={24} />
              </button>
            </div>

            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="item-avatar" style={{ '--from': '#22c55e', '--to': '#16a34a', width: '5rem', height: '5rem' } as any}>
                  {getJoueurInitials(selectedJoueur.nom, selectedJoueur.prenom)}
                </div>
                <div>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>
                    {selectedJoueur.prenom} {selectedJoueur.nom}
                  </h3>
                  <span className={`item-badge ${selectedJoueur.actif ? 'badge-green' : 'badge-red'}`}>
                    {selectedJoueur.actif ? 'Compte actif' : 'Compte inactif'}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Informations personnelles</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <User size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Nom complet</p>
                        <p style={{ fontWeight: 500 }}>{selectedJoueur.prenom} {selectedJoueur.nom}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Mail size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Email</p>
                        <p style={{ fontWeight: 500 }}>{selectedJoueur.email}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Phone size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Téléphone</p>
                        <p style={{ fontWeight: 500 }}>{selectedJoueur.telephone || 'N/A'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem' }}>Informations du compte</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Calendar size={18} style={{ color: '#9ca3af' }} />
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Date d'inscription</p>
                        <p style={{ fontWeight: 500 }}>{formatDate(selectedJoueur.dateInscription)}</p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '1rem', height: '1rem', borderRadius: '9999px', backgroundColor: selectedJoueur.actif ? '#22c55e' : '#dc2626' }}></div>
                      <div>
                        <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>Statut du compte</p>
                        <p style={{ fontWeight: 500 }}>{selectedJoueur.actif ? 'Actif' : 'Inactif'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: 600 }}>Actions</h4>
                  <button
                    onClick={() => handleToggleStatus(selectedJoueur.id)}
                    disabled={toggleLoading === selectedJoueur.id}
                    className="btn-submit"
                    style={{
                      background: selectedJoueur.actif ? 'linear-gradient(to right, #dc2626, #b91c1c)' : 'linear-gradient(to right, #22c55e, #16a34a)',
                      opacity: toggleLoading === selectedJoueur.id ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {toggleLoading === selectedJoueur.id ? (
                      <div className="spinner" style={{ width: '1rem', height: '1rem', borderColor: 'white', borderTopColor: 'transparent' }}></div>
                    ) : selectedJoueur.actif ? (
                      <ToggleRight size={18} />
                    ) : (
                      <ToggleLeft size={18} />
                    )}
                    <span>{selectedJoueur.actif ? 'Désactiver le compte' : 'Activer le compte'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Créer Joueur */}
      {showCreateForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Créer un nouveau joueur</h2>
              <button onClick={() => setShowCreateForm(false)} className="modal-close">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleCreateJoueur} className="modal-body">
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Nom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Dupont"
                    value={newJoueur.nom}
                    onChange={(e) => setNewJoueur({ ...newJoueur, nom: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Prénom *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Jean"
                    value={newJoueur.nom}
                    onChange={(e) => setNewJoueur({ ...newJoueur, nom: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="joueur@example.com"
                    value={newJoueur.email}
                    onChange={(e) => setNewJoueur({ ...newJoueur, email: e.target.value })}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Mot de passe *</label>
                  <input
                    type="password"
                    required
                    placeholder="Mot de passe"
                    value={newJoueur.motDePasse}
                    onChange={(e) => setNewJoueur({ ...newJoueur, motDePasse: e.target.value })}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)} className="btn-cancel">
                  Annuler
                </button>
                <button type="submit" className="btn-submit">
                  Créer le joueur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}