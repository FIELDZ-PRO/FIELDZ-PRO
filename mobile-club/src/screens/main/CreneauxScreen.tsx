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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme';
import { CreneauCard } from '../../components/CreneauCard';
import { CreneauModal } from '../../components/CreneauModal';
import { CreneauRecurrentModal } from '../../components/CreneauRecurrentModal';
import {
  getMyCreneaux,
  createCreneau,
  createCreneauRecurrent,
  deleteCreneau,
} from '../../api/creneaux';
import { getMyTerrains } from '../../api/terrains';
import { Creneau, Terrain, CreateCreneauRequest, CreateCreneauRecurrentRequest } from '../../types';

export default function CreneauxScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [simpleModalVisible, setSimpleModalVisible] = useState(false);
  const [recurrentModalVisible, setRecurrentModalVisible] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [creneauxData, terrainsData] = await Promise.all([
        getMyCreneaux(0, 50),
        getMyTerrains(),
      ]);

      setCreneaux(creneauxData.content);
      setTerrains(terrainsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Alert.alert('Erreur', 'Impossible de charger les créneaux');
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

  const handleCreateSimple = async (terrainId: number, data: CreateCreneauRequest) => {
    try {
      await createCreneau(terrainId, data);
      await fetchData();
      Alert.alert('Succès', 'Créneau créé avec succès');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      Alert.alert('Erreur', message);
      throw error;
    }
  };

  const handleCreateRecurrent = async (data: CreateCreneauRecurrentRequest) => {
    try {
      await createCreneauRecurrent(data);
      await fetchData();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      Alert.alert('Erreur', message);
      throw error;
    }
  };

  const handleDelete = (creneau: Creneau) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer ce créneau ?${
        !creneau.disponible ? '\n\nAttention: Ce créneau est réservé.' : ''
      }`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCreneau(creneau.id, true);
              await fetchData();
              Alert.alert('Succès', 'Créneau supprimé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le créneau');
            }
          },
        },
      ]
    );
  };

  const renderCreneau = ({ item }: { item: Creneau }) => (
    <TouchableOpacity
      style={styles.creneauContainer}
      onLongPress={() => handleDelete(item)}
      activeOpacity={0.7}
    >
      <CreneauCard creneau={item} />
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDelete(item)}
      >
        <Ionicons name="trash-outline" size={18} color={colors.error} />
        <Text style={styles.deleteText}>Supprimer</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primaryDark} />
      </View>
    );
  }

  if (terrains.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Ionicons name="football-outline" size={64} color={colors.border} />
        <Text style={styles.emptyText}>Aucun terrain configuré</Text>
        <Text style={styles.emptySubtext}>Créez d'abord un terrain pour ajouter des créneaux</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={creneaux}
        renderItem={renderCreneau}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color={colors.border} />
            <Text style={styles.emptyText}>Aucun créneau</Text>
            <Text style={styles.emptySubtext}>Créez votre premier créneau</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      {/* FAB with options */}
      {showOptions && (
        <View style={styles.fabOptions}>
          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setShowOptions(false);
              setRecurrentModalVisible(true);
            }}
          >
            <View style={styles.fabOptionContent}>
              <View style={styles.fabOptionButton}>
                <Ionicons name="repeat" size={20} color={colors.white} />
              </View>
              <Text style={styles.fabOptionText}>Récurrent</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.fabOption}
            onPress={() => {
              setShowOptions(false);
              setSimpleModalVisible(true);
            }}
          >
            <View style={styles.fabOptionContent}>
              <View style={styles.fabOptionButton}>
                <Ionicons name="calendar" size={20} color={colors.white} />
              </View>
              <Text style={styles.fabOptionText}>Simple</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity
        style={styles.fab}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Ionicons name={showOptions ? 'close' : 'add'} size={28} color={colors.white} />
      </TouchableOpacity>

      <CreneauModal
        visible={simpleModalVisible}
        terrains={terrains}
        onClose={() => setSimpleModalVisible(false)}
        onSubmit={handleCreateSimple}
      />

      <CreneauRecurrentModal
        visible={recurrentModalVisible}
        terrains={terrains}
        onClose={() => setRecurrentModalVisible(false)}
        onSubmit={handleCreateRecurrent}
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
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  creneauContainer: {
    marginBottom: 16,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.errorBg,
    marginTop: -8,
  },
  deleteText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.error,
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
  fabOptions: {
    position: 'absolute',
    right: 24,
    bottom: 96,
    gap: 16,
  },
  fabOption: {
    alignItems: 'flex-end',
  },
  fabOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  fabOptionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  fabOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});
