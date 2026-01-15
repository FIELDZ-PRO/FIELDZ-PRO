import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

type NewsDetailScreenRouteProp = RouteProp<MainStackParamList, 'NewsDetail'>;
type NewsDetailScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'NewsDetail'>;

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

export function NewsDetailScreen() {
  const navigation = useNavigation<NewsDetailScreenNavigationProp>();
  const route = useRoute<NewsDetailScreenRouteProp>();
  const { newsId } = route.params;
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{news.category}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Featured Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: news.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.title}>{news.title}</Text>

          {/* Author & Date */}
          <View style={styles.authorSection}>
            <View style={styles.authorInfo}>
              <View style={styles.avatar}>
                <Ionicons name="person" size={20} color={colors.white} />
              </View>
              <View>
                <Text style={styles.authorName}>{news.author}</Text>
                <Text style={styles.date}>{news.date}</Text>
              </View>
            </View>

            {/* Like/Dislike */}
            <View style={styles.reactions}>
              <TouchableOpacity
                onPress={handleLike}
                style={[
                  styles.reactionButton,
                  liked && styles.reactionButtonLiked
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={liked ? 'thumbs-up' : 'thumbs-up-outline'}
                  size={20}
                  color={liked ? colors.white : colors.textSecondary}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleDislike}
                style={[
                  styles.reactionButton,
                  disliked && styles.reactionButtonDisliked
                ]}
                activeOpacity={0.7}
              >
                <Ionicons
                  name={disliked ? 'thumbs-down' : 'thumbs-down-outline'}
                  size={20}
                  color={disliked ? colors.white : colors.textSecondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Report Content */}
          <Text style={styles.report}>{news.report}</Text>

          {/* Divider */}
          <View style={styles.divider} />
          <Text style={styles.footer}>
            Publié par l'équipe FIELDZ • Cliki Tiri Marki 🎯
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '900',
    fontSize: 24,
    letterSpacing: -0.48,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 256,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  content: {
    padding: spacing.xxl,
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '900',
    fontSize: 28,
    letterSpacing: -0.56,
    color: colors.text,
    lineHeight: 33.6,
    marginBottom: spacing.xxl,
  },
  authorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: spacing.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xxl,
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorName: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 14,
    color: colors.text,
  },
  date: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  reactions: {
    flexDirection: 'row',
    gap: 12,
  },
  reactionButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reactionButtonLiked: {
    backgroundColor: colors.primaryDark,
  },
  reactionButtonDisliked: {
    backgroundColor: '#EF4444',
  },
  report: {
    color: '#374151',
    fontSize: 16,
    lineHeight: 28.8,
    marginBottom: spacing.xxl,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.lg,
  },
  footer: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
