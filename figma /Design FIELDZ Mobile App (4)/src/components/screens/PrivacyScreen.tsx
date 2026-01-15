import React from 'react';
import { ArrowLeft, Shield } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
}

export function PrivacyScreen({ onBack }: PrivacyScreenProps) {
  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-24">
      {/* Header */}
      <div className="bg-white border-b border-[#E5E7EB]">
        <div className="max-w-md mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-[#F9FAFB] flex items-center justify-center hover:bg-[#E5E7EB] transition-colors"
            >
              <ArrowLeft className="w-6 h-6" style={{ color: '#0E0E0E' }} strokeWidth={2} />
            </button>
            <h1 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 900,
                fontSize: '28px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              Confidentialité
            </h1>
          </div>
        </div>
      </div>
      
      <div className="max-w-md mx-auto px-6 py-6">
        {/* Icon Header */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#1ED760] to-[#05602B] flex items-center justify-center">
            <Shield className="w-10 h-10 text-white" strokeWidth={2} />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-3xl p-6 card-shadow border border-[#E5E7EB] space-y-6">
          <div>
            <h2 
              style={{ 
                fontFamily: 'Poppins, sans-serif', 
                fontWeight: 800,
                fontSize: '20px',
                color: '#0E0E0E',
                marginBottom: '12px'
              }}
            >
              Politique de Confidentialité FIELDZ
            </h2>
            <p style={{ color: '#6B7280', fontSize: '14px', lineHeight: '1.6' }}>
              Dernière mise à jour : 2 Janvier 2026
            </p>
          </div>

          <div className="space-y-4" style={{ color: '#374151', fontSize: '15px', lineHeight: '1.7' }}>
            <section>
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0E0E0E',
                  marginBottom: '8px'
                }}
              >
                1. Collecte des données
              </h3>
              <p>
                FIELDZ collecte uniquement les informations nécessaires au bon fonctionnement de l'application : 
                nom, prénom, email, numéro de téléphone et historique de réservations.
              </p>
            </section>

            <section>
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0E0E0E',
                  marginBottom: '8px'
                }}
              >
                2. Utilisation des données
              </h3>
              <p>
                Vos données sont utilisées exclusivement pour traiter vos réservations, 
                vous contacter en cas de besoin et améliorer nos services. Nous ne vendons 
                jamais vos données à des tiers.
              </p>
            </section>

            <section>
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0E0E0E',
                  marginBottom: '8px'
                }}
              >
                3. Sécurité
              </h3>
              <p>
                Vos données sont protégées par des systèmes de sécurité avancés. 
                Toutes les communications sont chiffrées et vos informations de paiement 
                ne sont jamais stockées sur nos serveurs.
              </p>
            </section>

            <section>
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0E0E0E',
                  marginBottom: '8px'
                }}
              >
                4. Vos droits
              </h3>
              <p>
                Vous avez le droit d'accéder, de modifier ou de supprimer vos données 
                personnelles à tout moment. Contactez-nous à privacy@fieldz.dz pour 
                exercer ces droits.
              </p>
            </section>

            <section>
              <h3 
                style={{ 
                  fontFamily: 'Poppins, sans-serif', 
                  fontWeight: 700,
                  fontSize: '16px',
                  color: '#0E0E0E',
                  marginBottom: '8px'
                }}
              >
                5. Contact
              </h3>
              <p>
                Pour toute question concernant la confidentialité de vos données, 
                contactez-nous à support@fieldz.dz ou via l'application.
              </p>
            </section>
          </div>

          <div className="pt-4 border-t border-[#E5E7EB]">
            <p className="text-center" style={{ fontSize: '13px', color: '#6B7280' }}>
              © 2026 FIELDZ • Cliki Tiri Marki 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
