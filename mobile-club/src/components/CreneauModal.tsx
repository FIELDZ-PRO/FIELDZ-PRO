import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { colors } from '../theme';
import { Terrain, CreateCreneauRequest } from '../types';

interface CreneauModalProps {
  visible: boolean;
  terrains: Terrain[];
  onClose: () => void;
  onSubmit: (terrainId: number, data: CreateCreneauRequest) => Promise<void>;
}

export function CreneauModal({ visible, terrains, onClose, onSubmit }: CreneauModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    heureDebut: '08:00',
    heureFin: '09:00',
    prix: '1000',
  });

  useEffect(() => {
    if (visible && terrains.length > 0 && !selectedTerrain) {
      setSelectedTerrain(terrains[0].id);
    }
  }, [visible, terrains, selectedTerrain]);

  const handleSubmit = async () => {
    if (!selectedTerrain) {
      Alert.alert('Erreur', 'Veuillez sélectionner un terrain');
      return;
    }

    if (!formData.date || !formData.heureDebut || !formData.heureFin || !formData.prix) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    const dateDebut = `${formData.date}T${formData.heureDebut}:00`;
    const dateFin = `${formData.date}T${formData.heureFin}:00`;

    if (new Date(dateDebut) >= new Date(dateFin)) {
      Alert.alert('Erreur', 'L\'heure de fin doit être après l\'heure de début');
      return;
    }

    setLoading(true);
    try {
      await onSubmit(selectedTerrain, {
        dateDebut,
        dateFin,
        prix: parseFloat(formData.prix),
      });
      onClose();
      // Reset form
      setFormData({
        date: new Date().toISOString().split('T')[0],
        heureDebut: '08:00',
        heureFin: '09:00',
        prix: '1000',
      });
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
          <Text style={styles.title}>Nouveau créneau</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color={colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Terrain Selection */}
          <View style={styles.field}>
            <Text style={styles.label}>Terrain *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.chipsContainer}>
                {terrains.map((terrain) => (
                  <TouchableOpacity
                    key={terrain.id}
                    style={[
                      styles.chip,
                      selectedTerrain === terrain.id && styles.chipActive,
                    ]}
                    onPress={() => setSelectedTerrain(terrain.id)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedTerrain === terrain.id && styles.chipTextActive,
                      ]}
                    >
                      {terrain.nomTerrain}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <Input
            label="Date *"
            placeholder="YYYY-MM-DD"
            value={formData.date}
            onChangeText={(text) => setFormData({ ...formData, date: text })}
            hint="Format: 2025-01-15"
          />

          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Input
                label="Heure début *"
                placeholder="HH:mm"
                value={formData.heureDebut}
                onChangeText={(text) => setFormData({ ...formData, heureDebut: text })}
                hint="Ex: 08:00"
              />
            </View>
            <View style={styles.timeField}>
              <Input
                label="Heure fin *"
                placeholder="HH:mm"
                value={formData.heureFin}
                onChangeText={(text) => setFormData({ ...formData, heureFin: text })}
                hint="Ex: 09:00"
              />
            </View>
          </View>

          <Input
            label="Prix (Dzd) *"
            placeholder="1000"
            value={formData.prix}
            onChangeText={(text) => setFormData({ ...formData, prix: text })}
            keyboardType="numeric"
          />
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={handleSubmit} disabled={loading} fullWidth>
            {loading ? 'Création...' : 'Créer le créneau'}
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
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeField: {
    flex: 1,
  },
  footer: {
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
