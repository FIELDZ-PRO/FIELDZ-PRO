import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { ReservationDetailCard } from '../../components/ReservationDetailCard';
import {
  getMyReservations,
  confirmReservation,
  markAbsent,
  cancelReservation,
} from '../../api/reservations';
import { Reservation, Statut } from '../../types';

const STATUS_FILTERS: { label: string; value: Statut | 'ALL' }[] = [
  { label: 'Toutes', value: 'ALL' },
  { label: 'Réservées', value: 'RESERVE' },
  { label: 'Confirmées', value: 'CONFIRMEE' },
  { label: 'Absents', value: 'ABSENT' },
  { label: 'Annulées', value: 'ANNULE' },
];

export default function ReservationsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<Statut | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchReservations = useCallback(async () => {
    try {
      const data = await getMyReservations();
      setReservations(data);
      setFilteredReservations(data);
    } catch (error) {
      console.error('Failed to fetch reservations:', error);
      Alert.alert('Erreur', 'Impossible de charger les réservations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  useEffect(() => {
    filterReservations();
  }, [selectedStatus, searchQuery, reservations]);

  const filterReservations = () => {
    let result = reservations;

    if (selectedStatus !== 'ALL') {
      result = result.filter((r) => r.statut === selectedStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (r) =>
          r.joueur.nom.toLowerCase().includes(query) ||
          r.joueur.prenom.toLowerCase().includes(query) ||
          r.creneau.terrain.nomTerrain.toLowerCase().includes(query)
      );
    }

    setFilteredReservations(result);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchReservations();
  };

  const handleConfirm = async (id: number) => {
    Alert.alert('Confirmer la présence', 'Confirmer que le joueur est présent ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        onPress: async () => {
          try {
            await confirmReservation(id);
            await fetchReservations();
            Alert.alert('Succès', 'Présence confirmée');
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de confirmer la présence');
          }
        },
      },
    ]);
  };

  const handleMarkAbsent = async (id: number) => {
    Alert.alert('Marquer absent', 'Marquer le joueur comme absent ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Confirmer',
        style: 'destructive',
        onPress: async () => {
          try {
            await markAbsent(id);
            await fetchReservations();
            Alert.alert('Succès', 'Joueur marqué comme absent');
          } catch (error) {
            Alert.alert('Erreur', 'Impossible de marquer comme absent');
          }
        },
      },
    ]);
  };

  const handleCancel = async (id: number) => {
    Alert.alert(
      'Annuler la réservation',
      'Voulez-vous vraiment annuler cette réservation ?',
      [
        { text: 'Non', style: 'cancel' },
        {
          text: 'Oui, annuler',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelReservation(id, 'Annulée par le club');
              await fetchReservations();
              Alert.alert('Succès', 'Réservation annulée');
            } catch (error) {
              Alert.alert('Erreur', "Impossible d'annuler la réservation");
            }
          },
        },
      ]
    );
  };

  const renderReservation = ({ item }: { item: Reservation }) => (
    <ReservationDetailCard
      reservation={item}
      onConfirm={handleConfirm}
      onMarkAbsent={handleMarkAbsent}
      onCancel={handleCancel}
    />
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={colors.textSecondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher par nom ou terrain..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor={colors.textMuted}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.filtersContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.filters}>
            {STATUS_FILTERS.map((filter) => (
              <TouchableOpacity
                key={filter.value}
                style={[
                  styles.filterChip,
                  selectedStatus === filter.value && styles.filterChipActive,
                ]}
                onPress={() => setSelectedStatus(filter.value)}
              >
                <Text
                  style={[
                    styles.filterChipText,
                    selectedStatus === filter.value && styles.filterChipTextActive,
                  ]}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      <View style={styles.statsBar}>
        <Text style={styles.statsText}>
          {filteredReservations.length} réservation{filteredReservations.length > 1 ? 's' : ''}
        </Text>
        {selectedStatus === 'ALL' && (
          <Text style={styles.statsTextSecondary}>
            {reservations.filter((r) => r.statut === 'CONFIRMEE').length} confirmée(s)
          </Text>
        )}
      </View>

      <FlatList
        data={filteredReservations}
        renderItem={renderReservation}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.border} />
            <Text style={styles.emptyText}>Aucune réservation</Text>
            <Text style={styles.emptySubtext}>
              {selectedStatus !== 'ALL'
                ? 'Aucune réservation avec ce statut'
                : 'Les réservations apparaîtront ici'}
            </Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
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
  searchContainer: {
    padding: 16,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  filtersContainer: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  filterChipTextActive: {
    color: colors.white,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statsText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  statsTextSecondary: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  listContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyState: {
    paddingVertical: 80,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});
