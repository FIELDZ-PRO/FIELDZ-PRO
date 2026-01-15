import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { colors } from '../theme';
import { Terrain, CreateTerrainRequest, UpdateTerrainRequest } from '../types';

interface TerrainModalProps {
  visible: boolean;
  terrain?: Terrain;
  onClose: () => void;
  onSubmit: (data: CreateTerrainRequest | UpdateTerrainRequest) => Promise<void>;
}

const SPORTS = ['PADEL', 'FOOTBALL', 'FOOT5', 'TENNIS', 'BASKET'];
const SURFACES = ['Gazon synthétique', 'Gazon naturel', 'Parquet', 'Béton', 'Terre battue'];

export function TerrainModal({ visible, terrain, onClose, onSubmit }: TerrainModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nomTerrain: '',
    sport: 'PADEL',
    typeSurface: 'Gazon synthétique',
    ville: '',
  });

  useEffect(() => {
    if (terrain) {
      setFormData({
        nomTerrain: terrain.nomTerrain,
        sport: terrain.sport,
        typeSurface: terrain.typeSurface,
        ville: terrain.ville,
      });
    } else {
      setFormData({
        nomTerrain: '',
        sport: 'PADEL',
        typeSurface: 'Gazon synthétique',
        ville: '',
      });
    }
  }, [terrain, visible]);

  const handleSubmit = async () => {
    if (!formData.nomTerrain.trim() || !formData.ville.trim()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {terrain ? 'Modifier le terrain' : 'Nouveau terrain'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Input
            label="Nom du terrain *"
            placeholder="Ex: Terrain Padel 1"
            value={formData.nomTerrain}
            onChangeText={(text) => setFormData({ ...formData, nomTerrain: text })}
          />

          <View style={styles.field}>
            <Text style={styles.label}>Sport *</Text>
            <View style={styles.chipsContainer}>
              {SPORTS.map((sport) => (
                <TouchableOpacity
                  key={sport}
                  style={[
                    styles.chip,
                    formData.sport === sport && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, sport })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.sport === sport && styles.chipTextActive,
                    ]}
                  >
                    {sport}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Type de surface *</Text>
            <View style={styles.chipsContainer}>
              {SURFACES.map((surface) => (
                <TouchableOpacity
                  key={surface}
                  style={[
                    styles.chip,
                    formData.typeSurface === surface && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, typeSurface: surface })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.typeSurface === surface && styles.chipTextActive,
                    ]}
                  >
                    {surface}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Ville *"
            placeholder="Ex: Alger"
            value={formData.ville}
            onChangeText={(text) => setFormData({ ...formData, ville: text })}
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={handleSubmit} disabled={loading} fullWidth>
            {loading ? 'Enregistrement...' : terrain ? 'Mettre à jour' : 'Créer'}
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  chipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  chipTextActive: {
    color: colors.white,
  },
  footer: {
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
