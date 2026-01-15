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
import { TerrainCard } from '../../components/TerrainCard';
import { TerrainModal } from '../../components/TerrainModal';
import {
  getMyTerrains,
  createTerrain,
  updateTerrain,
  deleteTerrain,
} from '../../api/terrains';
import { Terrain, CreateTerrainRequest, UpdateTerrainRequest } from '../../types';

export default function TerrainsScreen() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [terrains, setTerrains] = useState<Terrain[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState<Terrain | undefined>();

  const fetchTerrains = useCallback(async () => {
    try {
      const data = await getMyTerrains();
      setTerrains(data);
    } catch (error) {
      console.error('Failed to fetch terrains:', error);
      Alert.alert('Erreur', 'Impossible de charger les terrains');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchTerrains();
  }, [fetchTerrains]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchTerrains();
  };

  const handleCreate = () => {
    setSelectedTerrain(undefined);
    setModalVisible(true);
  };

  const handleEdit = (terrain: Terrain) => {
    setSelectedTerrain(terrain);
    setModalVisible(true);
  };

  const handleDelete = (terrain: Terrain) => {
    Alert.alert(
      'Confirmer la suppression',
      `Voulez-vous vraiment supprimer le terrain "${terrain.nomTerrain}" ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteTerrain(terrain.id);
              await fetchTerrains();
              Alert.alert('Succès', 'Terrain supprimé avec succès');
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le terrain');
            }
          },
        },
      ]
    );
  };

  const handleSubmit = async (data: CreateTerrainRequest | UpdateTerrainRequest) => {
    try {
      if (selectedTerrain) {
        await updateTerrain(selectedTerrain.id, data);
        Alert.alert('Succès', 'Terrain modifié avec succès');
      } else {
        await createTerrain(data as CreateTerrainRequest);
        Alert.alert('Succès', 'Terrain créé avec succès');
      }
      await fetchTerrains();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      Alert.alert('Erreur', message);
      throw error;
    }
  };

  const renderTerrain = ({ item }: { item: Terrain }) => (
    <TouchableOpacity
      style={styles.terrainContainer}
      onLongPress={() => handleEdit(item)}
      activeOpacity={0.7}
    >
      <TerrainCard terrain={item} />
      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="pencil" size={18} color={colors.white} />
          <Text style={styles.actionText}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash" size={18} color={colors.white} />
          <Text style={styles.actionText}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
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
      <FlatList
        data={terrains}
        renderItem={renderTerrain}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="football-outline" size={64} color={colors.border} />
            <Text style={styles.emptyText}>Aucun terrain</Text>
            <Text style={styles.emptySubtext}>Créez votre premier terrain</Text>
          </View>
        }
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />

      <TouchableOpacity style={styles.fab} onPress={handleCreate}>
        <Ionicons name="add" size={28} color={colors.white} />
      </TouchableOpacity>

      <TerrainModal
        visible={modalVisible}
        terrain={selectedTerrain}
        onClose={() => setModalVisible(false)}
        onSubmit={handleSubmit}
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
  terrainContainer: {
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: -8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButton: {
    backgroundColor: colors.primaryDark,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
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
