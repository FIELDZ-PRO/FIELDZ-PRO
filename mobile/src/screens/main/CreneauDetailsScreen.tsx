import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { createReservation } from '../../api/reservations';
import { MainStackParamList } from '../../navigation/types';
import { colors, borderRadius, typography } from '../../theme';

type Props = NativeStackScreenProps<MainStackParamList, 'CreneauDetails'>;

export default function CreneauDetailsScreen({ route, navigation }: Props) {
  const { creneau } = route.params;
  const [loading, setLoading] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleReservation = async () => {
    Alert.alert(
      'Confirmer la reservation',
      `Voulez-vous reserver ce creneau pour ${creneau.prix} DA ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: async () => {
            setLoading(true);
            try {
              await createReservation(creneau.id);
              Alert.alert('Succes', 'Votre reservation a ete effectuee !', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error: any) {
              Alert.alert(
                'Erreur',
                error.response?.data?.message || 'Impossible de reserver ce creneau'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details du creneau</Text>
          <View style={{ width: 44 }} />
        </View>

        <View style={styles.content}>
          <View style={styles.mainCard}>
            <Text style={styles.clubName}>
              {creneau.terrain.club?.nomClub || creneau.terrain.club?.nom || 'Club'}
            </Text>
            <Text style={styles.terrainName}>{creneau.terrain.nomTerrain}</Text>

            <View style={styles.tags}>
              {creneau.terrain.sport && (
                <View style={styles.tag}>
                  <Ionicons name="football-outline" size={14} color={colors.primary} />
                  <Text style={styles.tagText}>{creneau.terrain.sport}</Text>
                </View>
              )}
              {creneau.terrain.typeSurface && (
                <View style={styles.tag}>
                  <Ionicons name="layers-outline" size={14} color={colors.primary} />
                  <Text style={styles.tagText}>{creneau.terrain.typeSurface}</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Date et heure</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="calendar" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Date</Text>
                  <Text style={styles.date}>{formatDate(creneau.dateDebut)}</Text>
                </View>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoRow}>
                <View style={styles.infoIcon}>
                  <Ionicons name="time" size={20} color={colors.primary} />
                </View>
                <View>
                  <Text style={styles.infoLabel}>Horaire</Text>
                  <Text style={styles.time}>
                    {formatTime(creneau.dateDebut)} - {formatTime(creneau.dateFin)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {creneau.terrain.ville && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Localisation</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <View style={styles.infoIcon}>
                    <Ionicons name="location" size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.infoText}>{creneau.terrain.ville}</Text>
                </View>
              </View>
            </View>
          )}

          {creneau.terrain.politiqueClub && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Politique du club</Text>
              <View style={styles.infoCard}>
                <Text style={styles.policyText}>{creneau.terrain.politiqueClub}</Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Prix total</Text>
          <Text style={styles.price}>{creneau.prix} DA</Text>
        </View>
        <TouchableOpacity
          style={[styles.reserveButton, loading && styles.reserveButtonDisabled]}
          onPress={handleReservation}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={20} color={colors.white} />
              <Text style={styles.reserveButtonText}>Reserver</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.text,
  },
  content: {
    padding: 16,
  },
  mainCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  clubName: {
    fontSize: typography.sm,
    color: colors.primary,
    fontWeight: '600',
    marginBottom: 8,
  },
  terrainName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 16,
  },
  tags: {
    flexDirection: 'row',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: `${colors.primary}15`,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: borderRadius.sm,
  },
  tagText: {
    color: colors.primary,
    fontSize: typography.sm,
    fontWeight: '500',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: typography.xs,
    fontWeight: '600',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.xl,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.cardBorder,
    marginHorizontal: 16,
  },
  date: {
    fontSize: typography.md,
    color: colors.text,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  time: {
    fontSize: typography.lg,
    fontWeight: '600',
    color: colors.primary,
  },
  infoText: {
    fontSize: typography.md,
    color: colors.text,
    fontWeight: '500',
  },
  policyText: {
    fontSize: typography.md,
    color: colors.textSecondary,
    lineHeight: 22,
    padding: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    gap: 16,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: typography.xs,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  price: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
  },
  reserveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: borderRadius.lg,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reserveButtonDisabled: {
    opacity: 0.7,
  },
  reserveButtonText: {
    color: colors.white,
    fontSize: typography.lg,
    fontWeight: '700',
  },
});
