import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';

interface NewsItem {
  id: number;
  category: string;
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  image: string;
  textColor: string;
}

const newsData: NewsItem[] = [
  {
    id: 1,
    category: 'Nouveauté',
    iconName: 'sparkles',
    title: 'Réservation instantanée disponible',
    description: 'Réserve ton terrain en 3 clics. Plus besoin d\'attendre la confirmation, ton créneau est confirmé instantanément.',
    image: 'https://images.unsplash.com/photo-1705593813682-033ee2991df6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBzdGFkaXVtJTIwYWVyaWFsfGVufDF8fHx8MTc2NjkyOTc5MHww&ixlib=rb-4.1.0&q=80&w=1080',
    textColor: '#9333EA'
  },
  {
    id: 2,
    category: 'Communauté',
    iconName: 'people',
    title: 'Rejoins des matchs près de chez toi',
    description: 'Trouve des équipes qui recherchent des joueurs pour compléter leur match. Pas besoin d\'avoir une équipe complète.',
    image: 'https://images.unsplash.com/photo-1760174012435-630a17a434ed?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb24lMjB0ZWFtfGVufDF8fHx8MTc2NjkyOTcwM3ww&ixlib=rb-4.1.0&q=80&w=1080',
    textColor: '#0284C7'
  },
  {
    id: 3,
    category: 'Événement',
    iconName: 'trophy',
    title: 'Tournoi FIELDZ - Janvier 2025',
    description: 'Inscris-toi au premier tournoi national FIELDZ. 32 équipes, 3 jours de compétition intense à Alger.',
    image: 'https://images.unsplash.com/photo-1747423514926-5e368319effb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkJTIwbGlnaHRzfGVufDF8fHx8MTc2NjkyOTYwNHww&ixlib=rb-4.1.0&q=80&w=1080',
    textColor: '#D97706'
  }
];

export default function NewsScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>News FIELDZ</Text>
        <Text style={styles.subtitle}>Nouveautés, événements et actualités</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* News Cards */}
        {newsData.map((news) => (
          <View key={news.id} style={styles.newsCard}>
            {/* Image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: news.image }}
                style={styles.newsImage}
                resizeMode="cover"
              />
              <View style={styles.imageOverlay} />

              {/* Category Badge */}
              <View style={styles.categoryBadge}>
                <Ionicons name={news.iconName} size={14} color={news.textColor} />
                <Text style={[styles.categoryText, { color: news.textColor }]}>
                  {news.category.toUpperCase()}
                </Text>
              </View>
            </View>

            {/* Content */}
            <View style={styles.newsContent}>
              <Text style={styles.newsTitle}>{news.title}</Text>
              <Text style={styles.newsDescription}>{news.description}</Text>

              <TouchableOpacity style={styles.readMoreButton}>
                <Text style={[styles.readMoreText, { color: news.textColor }]}>
                  En savoir plus
                </Text>
                <Ionicons name="arrow-forward" size={16} color={news.textColor} />
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* Coming Soon Teaser */}
        <View style={styles.comingSoonCard}>
          <View style={styles.comingSoonIcon}>
            <Ionicons name="sparkles" size={32} color={colors.white} />
          </View>
          <Text style={styles.comingSoonTitle}>Plus de nouveautés bientôt</Text>
          <Text style={styles.comingSoonText}>On prépare des surprises 👀</Text>
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
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    letterSpacing: -0.64,
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  newsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  imageContainer: {
    position: 'relative',
    height: 224,
  },
  newsImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.55,
  },
  newsContent: {
    padding: 24,
  },
  newsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    lineHeight: 26.4,
    marginBottom: 12,
  },
  newsDescription: {
    fontSize: 15,
    lineHeight: 24,
    color: colors.textSecondary,
    fontWeight: '500',
    marginBottom: 20,
  },
  readMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    alignSelf: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  readMoreText: {
    fontSize: 14,
    fontWeight: '700',
  },
  comingSoonCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  comingSoonIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  comingSoonTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
