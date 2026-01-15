import React, { useState } from 'react';
import { ArrowLeft, ThumbsUp, ThumbsDown, User } from 'lucide-react';

interface NewsDetailScreenProps {
  newsId: number;
  onBack: () => void;
}

const newsDetails: Record<number, any> = {
  1: {
    category: 'Nouveauté',
    title: 'Réservation instantanée disponible',
    image: 'https://images.unsplash.com/photo-1705593813682-033ee2991df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwYWVyaWFsfGVufDF8fHx8MTc2NjkyOTc5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Équipe FIELDZ',
    date: '2 Janvier 2026',
    report: `Nous sommes ravis d'annoncer le lancement de notre nouvelle fonctionnalité de réservation instantanée !

Cette innovation majeure transforme complètement l'expérience utilisateur sur FIELDZ. Désormais, vous pouvez réserver votre terrain de sport en seulement 3 clics, sans avoir à attendre de confirmation manuelle.

Comment ça marche ?
1. Choisissez votre club préféré
2. Sélectionnez un créneau disponible
3. Confirmez votre réservation

Et voilà ! Votre terrain est immédiatement réservé. Plus besoin d'attendre des heures pour une confirmation par email ou téléphone.

Cette fonctionnalité est le résultat de plusieurs mois de développement et de collaboration étroite avec nos clubs partenaires. Nous avons mis en place un système de synchronisation en temps réel qui garantit la disponibilité de chaque créneau affiché.

Les avantages :
• Gain de temps considérable
• Confirmation instantanée
• Interface simplifiée
• Disponibilité en temps réel

Cette mise à jour est disponible dès maintenant pour tous les utilisateurs FIELDZ en Algérie. Profitez-en pour réserver vos prochains matchs !`
  },
  2: {
    category: 'Communauté',
    title: 'Rejoins des matchs près de chez toi',
    image: 'https://images.unsplash.com/photo-1760174012435-630a17a434ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb24lMjB0ZWFtfGVufDF8fHx8MTc2NjkyOTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Karim Benali',
    date: '28 Décembre 2025',
    report: `La communauté FIELDZ s'agrandit ! Nous lançons une nouvelle fonctionnalité qui va révolutionner la façon dont vous trouvez des coéquipiers et des adversaires.

Le problème que nous résolvons :
Vous êtes motivé pour jouer, mais votre équipe habituelle n'est pas disponible ? Plus de souci ! Notre nouvelle fonction "Rejoindre un match" vous permet de trouver des équipes qui cherchent des joueurs près de chez vous.

Comment ça fonctionne ?
Les équipes peuvent maintenant publier leurs matchs avec le nombre de joueurs manquants. Vous pouvez parcourir ces annonces, filtrer par sport, niveau et localisation, puis rejoindre le match de votre choix.

Fonctionnalités principales :
• Recherche par ville et quartier
• Filtres par sport et niveau
• Chat avec l'équipe avant de rejoindre
• Système de notation et commentaires
• Historique de vos matchs

Depuis le lancement en bêta il y a 3 semaines, plus de 500 matchs ont été complétés grâce à cette fonctionnalité. La communauté FIELDZ est en pleine croissance !

Rejoignez-nous et ne manquez plus jamais une occasion de jouer !`
  },
  3: {
    category: 'Événement',
    title: 'Tournoi FIELDZ - Janvier 2025',
    image: 'https://images.unsplash.com/photo-1747423514926-5e368319effb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkJTIwbGlnaHRzfGVufDF8fHx8MTc2NjkyOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    author: 'Yacine Meziane',
    date: '20 Décembre 2025',
    report: `Le premier tournoi national FIELDZ arrive en Janvier 2026 !

Nous sommes fiers d'annoncer l'organisation du premier tournoi national FIELDZ. Cet événement majeur réunira 32 équipes de toute l'Algérie pour 3 jours de compétition intense au Complexe Olympique d'Alger.

Détails du tournoi :
• Date : 24-26 Janvier 2026
• Lieu : Complexe Olympique, Alger
• Format : 32 équipes, élimination directe
• Catégorie : Football à 7
• Prize Pool : 500,000 DA

Comment s'inscrire ?
Les inscriptions sont ouvertes dès maintenant via l'application FIELDZ. Les 32 premières équipes validées seront sélectionnées. Le tarif d'inscription est de 15,000 DA par équipe.

Conditions de participation :
• Équipe de 7-10 joueurs
• Âge minimum : 16 ans
• Licence sportive recommandée
• Respect du fair-play obligatoire

Ce que vous obtenez :
• 3 matchs garantis minimum
• Maillots officiels du tournoi
• Couverture photo/vidéo professionnelle
• Buffet pour les joueurs
• Trophées et médailles
• Dotations pour le top 3

Ne manquez pas cette opportunité unique de participer au premier grand événement FIELDZ et de représenter votre ville !

Les places sont limitées, inscrivez-vous rapidement !`
  }
};

export function NewsDetailScreen({ newsId, onBack }: NewsDetailScreenProps) {
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const news = newsDetails[newsId];

  const handleLike = () => {
    if (disliked) setDisliked(false);
    setLiked(!liked);
  };

  const handleDislike = () => {
    if (liked) setLiked(false);
    setDisliked(!disliked);
  };

  if (!news) {
    return null;
  }

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
                fontSize: '24px',
                letterSpacing: '-0.02em',
                color: '#0E0E0E'
              }}
            >
              {news.category}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto">
        {/* Featured Image */}
        <div className="relative h-64">
          <img 
            src={news.image}
            alt={news.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>

        <div className="px-6 py-6 space-y-6">
          {/* Title */}
          <h1 
            style={{ 
              fontFamily: 'Poppins, sans-serif', 
              fontWeight: 900,
              fontSize: '28px',
              letterSpacing: '-0.02em',
              color: '#0E0E0E',
              lineHeight: '1.2'
            }}
          >
            {news.title}
          </h1>

          {/* Author & Date */}
          <div className="flex items-center justify-between pb-6 border-b border-[#E5E7EB]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#1ED760] to-[#05602B] flex items-center justify-center">
                <User className="w-5 h-5 text-white" strokeWidth={2} />
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins, sans-serif', fontWeight: 700, fontSize: '14px', color: '#0E0E0E' }}>
                  {news.author}
                </p>
                <p style={{ fontSize: '13px', color: '#6B7280' }}>
                  {news.date}
                </p>
              </div>
            </div>

            {/* Like/Dislike */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  liked ? 'bg-[#05602B] text-white' : 'bg-[#F9FAFB] hover:bg-[#E5E7EB]'
                }`}
                style={{ color: liked ? '#FFFFFF' : '#6B7280' }}
              >
                <ThumbsUp className="w-5 h-5" strokeWidth={2} fill={liked ? '#FFFFFF' : 'none'} />
              </button>
              <button
                onClick={handleDislike}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  disliked ? 'bg-red-500 text-white' : 'bg-[#F9FAFB] hover:bg-[#E5E7EB]'
                }`}
                style={{ color: disliked ? '#FFFFFF' : '#6B7280' }}
              >
                <ThumbsDown className="w-5 h-5" strokeWidth={2} fill={disliked ? '#FFFFFF' : 'none'} />
              </button>
            </div>
          </div>

          {/* Report Content */}
          <div 
            className="prose prose-lg"
            style={{ 
              color: '#374151',
              fontSize: '16px',
              lineHeight: '1.8',
              whiteSpace: 'pre-line'
            }}
          >
            {news.report}
          </div>

          {/* Divider */}
          <div className="pt-6 border-t border-[#E5E7EB]">
            <p className="text-center" style={{ fontSize: '13px', color: '#6B7280' }}>
              Publié par l'équipe FIELDZ • Cliki Tiri Marki 🎯
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
