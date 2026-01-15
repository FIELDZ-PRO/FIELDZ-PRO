import React from 'react';
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

type AboutClubScreenRouteProp = RouteProp<MainStackParamList, 'AboutClub'>;
type AboutClubScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'AboutClub'>;

const clubAboutData: Record<number, any> = {
  1: {
    name: 'Hydra Sports Club',
    location: 'Hydra, Alger',
    phone: '0609837382',
    email: 'contact@hydrasports.dz',
    academy: 'Non renseigné',
    hours: 'Lun-Dim 08:00-23:00',
    image: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBmaWVsZHxlbnwxfHx8fDE3NjY5Mjc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    description: `Hydra Sports Club est l'un des clubs sportifs les plus prestigieux d'Alger. Situé au cœur du quartier de Hydra, notre complexe offre des installations modernes et de qualité pour tous les amateurs de sport.

Avec plus de 10 ans d'expérience, nous nous engageons à fournir les meilleures infrastructures pour la pratique du football et du padel. Nos terrains sont entretenus quotidiennement pour garantir une expérience de jeu optimale.`,
    facilities: [
      '2 terrains de football synthétique',
      '3 courts de padel professionnels',
      'Vestiaires modernes avec douches',
      'Parking gratuit pour 50 véhicules',
      'Cafétéria et espace détente',
      'Éclairage nocturne LED'
    ],
    services: [
      'Réservation en ligne 24/7',
      'Location d\'équipement sportif',
      'Coaching professionnel disponible',
      'Organisation de tournois',
      'Programmes d\'entraînement jeunes'
    ]
  }
};

export function AboutClubScreen() {
  const navigation = useNavigation<AboutClubScreenNavigationProp>();
  const route = useRoute<AboutClubScreenRouteProp>();
  const { clubId } = route.params;
  const club = clubAboutData[clubId] || clubAboutData[1];

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
          <Text style={styles.headerTitle}>À propos</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Featured Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: club.image }}
            style={styles.image}
            resizeMode="cover"
          />
          <View style={styles.imageOverlay} />
        </View>

        <View style={styles.content}>
          {/* Club Name */}
          <View style={styles.nameSection}>
            <Text style={styles.clubName}>{club.name}</Text>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={16} color={colors.primaryDark} />
              <Text style={styles.locationText}>{club.location}</Text>
            </View>
          </View>

          {/* Contact Info */}
          <View style={styles.contactCard}>
            <Text style={styles.cardTitle}>Contact</Text>

            <View style={styles.contactItems}>
              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="call" size={20} color={colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Téléphone</Text>
                  <Text style={styles.contactValue}>{club.phone}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="time" size={20} color={colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Horaires</Text>
                  <Text style={styles.contactValue}>{club.hours}</Text>
                </View>
              </View>

              <View style={styles.contactItem}>
                <View style={styles.contactIcon}>
                  <Ionicons name="home" size={20} color={colors.primaryDark} />
                </View>
                <View>
                  <Text style={styles.contactLabel}>Académie</Text>
                  <Text style={styles.contactValue}>{club.academy}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Description */}
          <View style={styles.descriptionCard}>
            <Text style={styles.cardTitle}>Description</Text>
            <Text style={styles.description}>{club.description}</Text>
          </View>

          {/* Facilities */}
          <View style={styles.facilitiesCard}>
            <View style={styles.facilitiesHeader}>
              <Ionicons name="trophy" size={20} color={colors.primaryDark} />
              <Text style={styles.cardTitle}>Installations</Text>
            </View>
            <View style={styles.list}>
              {club.facilities.map((facility: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.listText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Services */}
          <View style={styles.servicesCard}>
            <View style={styles.servicesHeader}>
              <Ionicons name="people" size={20} color={colors.primaryDark} />
              <Text style={styles.cardTitle}>Services</Text>
            </View>
            <View style={styles.list}>
              {club.services.map((service: string, index: number) => (
                <View key={index} style={styles.listItem}>
                  <Text style={styles.checkmark}>✓</Text>
                  <Text style={styles.listText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>
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
    gap: spacing.xxl,
  },
  nameSection: {
    gap: 8,
  },
  clubName: {
    fontFamily: 'Poppins',
    fontWeight: '900',
    fontSize: 28,
    letterSpacing: -0.56,
    color: colors.text,
    lineHeight: 33.6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  contactCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    gap: spacing.lg,
    ...shadows.soft,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: 18,
    color: colors.text,
  },
  contactItems: {
    gap: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  contactValue: {
    fontSize: 15,
    color: colors.text,
    fontWeight: '700',
  },
  descriptionCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    gap: 12,
    ...shadows.soft,
  },
  description: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 25.5,
  },
  facilitiesCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    gap: spacing.lg,
    ...shadows.soft,
  },
  facilitiesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  servicesCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
    gap: spacing.lg,
    ...shadows.soft,
  },
  servicesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  list: {
    gap: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  checkmark: {
    color: colors.primaryDark,
    fontSize: 18,
    lineHeight: 22.5,
  },
  listText: {
    flex: 1,
    color: '#374151',
    fontSize: 15,
    lineHeight: 22.5,
  },
});
