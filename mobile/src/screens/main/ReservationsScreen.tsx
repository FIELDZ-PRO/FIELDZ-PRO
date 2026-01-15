import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Reservation, Statut } from '../../types';
import { getMyReservations, cancelReservation } from '../../api/reservations';
import { Button } from '../../components/ui/Button';
import { colors, borderRadius, shadows } from '../../theme';

type TabType = 'upcoming' | 'past' | 'cancelled';

const STATUS_CONFIG: Record<Statut, { label: string; color: string; bg: string }> = {
  RESERVE: { label: 'En attente', color: '#F59E0B', bg: '#FEF3C7' },
  CONFIRMEE: { label: 'Confirmee', color: '#05602B', bg: '#D1FAE5' },
  ANNULE: { label: 'Annulee', color: '#EF4444', bg: '#FEE2E2' },
  ANNULE_PAR_JOUEUR: { label: 'Annulee', color: '#EF4444', bg: '#FEE2E2' },
  ANNULE_PAR_CLUB: { label: 'Annulee par le club', color: '#EF4444', bg: '#FEE2E2' },
  LIBRE: { label: 'Libre', color: '#6B7280', bg: '#F3F4F6' },
};

export default function ReservationsScreen() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('upcoming');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'upcoming', label: 'A venir' },
    { id: 'past', label: 'Passees' },
    { id: 'cancelled', label: 'Annulees' },
  ];

  const fetchReservations = useCallback(async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const handleCancel = (reservation: Reservation) => {
    Alert.alert(
      'Annuler la reservation',
      'Etes-vous sur de vouloir annuler cette reservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelReservation(reservation.id);
              fetchReservations();
              Alert.alert('Succes', 'Reservation annulee');
            } catch (error) {
              Alert.alert('Erreur', "Impossible d'annuler la reservation");
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isUpcoming = (reservation: Reservation) => {
    const now = new Date();
    const reservationDate = new Date(reservation.creneau.dateDebut);
    return reservationDate > now && ['RESERVE', 'CONFIRMEE'].includes(reservation.statut);
  };

  const isPast = (reservation: Reservation) => {
    const now = new Date();
    const reservationDate = new Date(reservation.creneau.dateDebut);
    return reservationDate <= now && !['ANNULE', 'ANNULE_PAR_JOUEUR', 'ANNULE_PAR_CLUB'].includes(reservation.statut);
  };

  const isCancelled = (reservation: Reservation) => {
    return ['ANNULE', 'ANNULE_PAR_JOUEUR', 'ANNULE_PAR_CLUB'].includes(reservation.statut);
  };

  const filteredReservations = reservations.filter((r) => {
    if (activeTab === 'upcoming') return isUpcoming(r);
    if (activeTab === 'past') return isPast(r);
    if (activeTab === 'cancelled') return isCancelled(r);
    return false;
  });

  const canCancel = (reservation: Reservation) => {
    return isUpcoming(reservation);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Reservations</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <View style={styles.tabs}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.tab,
                activeTab === tab.id && styles.tabActive,
              ]}
              onPress={() => setActiveTab(tab.id)}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Reservations List */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {filteredReservations.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.textMuted} />
            <Text style={styles.emptyText}>
              Aucune reservation {activeTab === 'upcoming' ? 'a venir' : activeTab === 'past' ? 'passee' : 'annulee'}
            </Text>
          </View>
        ) : (
          <View style={styles.reservationsList}>
            {filteredReservations.map((reservation) => {
              const config = STATUS_CONFIG[reservation.statut];
              return (
                <View key={reservation.id} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={styles.cardInfo}>
                      <Text style={styles.clubName}>
                        {reservation.creneau.terrain.club?.nomClub || 'Club'}
                      </Text>
                      <Text style={styles.terrainName}>
                        {reservation.creneau.terrain.nomTerrain}
                      </Text>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
                      <Text style={[styles.statusText, { color: config.color }]}>
                        {config.label}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.details}>
                    <View style={styles.detailRow}>
                      <Ionicons name="calendar-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {formatDate(reservation.creneau.dateDebut)}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
                      <Text style={styles.detailText}>
                        {formatTime(reservation.creneau.dateDebut)} - {formatTime(reservation.creneau.dateFin)}
                      </Text>
                    </View>
                  </View>

                  {canCancel(reservation) && (
                    <Button
                      variant="outline"
                      fullWidth
                      onPress={() => handleCancel(reservation)}
                    >
                      Annuler la reservation
                    </Button>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
  },
  tabsContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
  },
  tabs: {
    flexDirection: 'row',
    gap: 24,
  },
  tab: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 100,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  reservationsList: {
    gap: 16,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardInfo: {
    flex: 1,
  },
  clubName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  terrainName: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
