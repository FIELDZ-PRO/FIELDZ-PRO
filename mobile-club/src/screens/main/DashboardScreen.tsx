import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors } from '../../theme';
import { StatCard } from '../../components/StatCard';
import { ReservationCard } from '../../components/ReservationCard';
import { TerrainCard } from '../../components/TerrainCard';
import { getTodayStats, getReservationsByDate } from '../../api/reservations';
import { getMyTerrains } from '../../api/terrains';
import { getMyClub } from '../../api/club';
import { Reservation, Terrain, Club } from '../../types';

export default function DashboardScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [club, setClub] = useState<Club | null>(null);
  const [stats, setStats] = useState({
    totalReservations: 0,
    confirmedReservations: 0,
    revenue: 0,
  });
  const [todayReservations, setTodayReservations] = useState<Reservation[]>([]);
  const [terrains, setTerrains] = useState<Terrain[]>([]);

  const fetchData = useCallback(async () => {
    try {
      const [clubData, statsData, today, terrainsData] = await Promise.all([
        getMyClub(),
        getTodayStats(),
        getReservationsByDate(new Date().toISOString().split('T')[0]),
        getMyTerrains(),
      ]);

      setClub(clubData);
      setStats(statsData);
      setTodayReservations(today);
      setTerrains(terrainsData);
    } catch (error: any) {
      console.error('Failed to fetch dashboard data:', error);
      Alert.alert('Erreur', 'Impossible de charger les données');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour 👋</Text>
          <Text style={styles.clubName}>{club?.nom || club?.nomClub || 'Votre Club'}</Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aujourd'hui</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statsContainer}
        >
          <StatCard
            title="Réservations"
            value={stats.totalReservations}
            icon="calendar"
            color={colors.primaryDark}
          />
          <StatCard
            title="Confirmées"
            value={stats.confirmedReservations}
            icon="checkmark-circle"
            color={colors.success}
          />
          <StatCard
            title="Revenus"
            value={`${stats.revenue} Dzd`}
            icon="cash"
            color={colors.primary}
          />
          <StatCard
            title="Terrains"
            value={terrains.length}
            icon="football"
            color={colors.warning}
          />
        </ScrollView>
      </View>

      {/* Today's Reservations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réservations du jour</Text>
        {todayReservations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucune réservation aujourd'hui</Text>
          </View>
        ) : (
          todayReservations
            .slice(0, 5)
            .map((reservation) => (
              <ReservationCard key={reservation.id} reservation={reservation} />
            ))
        )}
      </View>

      {/* Terrains */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vos terrains</Text>
        {terrains.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Aucun terrain configuré</Text>
          </View>
        ) : (
          terrains.slice(0, 3).map((terrain) => <TerrainCard key={terrain.id} terrain={terrain} />)
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    paddingBottom: 32,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 24,
    paddingTop: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  greeting: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  clubName: {
    fontSize: 24,
    fontWeight: '900',
    color: colors.text,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: 24,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  statsContainer: {
    gap: 12,
    paddingRight: 24,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
