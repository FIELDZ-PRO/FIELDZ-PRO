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
import { Terrain, CreateCreneauRecurrentRequest } from '../types';

interface CreneauRecurrentModalProps {
  visible: boolean;
  terrains: Terrain[];
  onClose: () => void;
  onSubmit: (data: CreateCreneauRecurrentRequest) => Promise<void>;
}

const DAYS_OF_WEEK = [
  { label: 'Lun', value: 1 },
  { label: 'Mar', value: 2 },
  { label: 'Mer', value: 3 },
  { label: 'Jeu', value: 4 },
  { label: 'Ven', value: 5 },
  { label: 'Sam', value: 6 },
  { label: 'Dim', value: 0 },
];

const DURATIONS = [
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1h', value: 60 },
  { label: '1h30', value: 90 },
  { label: '2h', value: 120 },
];

export function CreneauRecurrentModal({ visible, terrains, onClose, onSubmit }: CreneauRecurrentModalProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTerrain, setSelectedTerrain] = useState<number | null>(null);
  const [selectedDays, setSelectedDays] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    heureDebut: '08:00',
    dureeMinutes: 60,
    prix: '1000',
    dateDebut: new Date().toISOString().split('T')[0],
    dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +30 days
  });

  useEffect(() => {
    if (visible && terrains.length > 0 && !selectedTerrain) {
      setSelectedTerrain(terrains[0].id);
    }
  }, [visible, terrains, selectedTerrain]);

  const toggleDay = (day: number) => {
    if (selectedDays.includes(day)) {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    } else {
      setSelectedDays([...selectedDays, day]);
    }
  };

  const handleSubmit = async () => {
    if (!selectedTerrain) {
      Alert.alert('Erreur', 'Veuillez sélectionner un terrain');
      return;
    }

    if (selectedDays.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un jour de la semaine');
      return;
    }

    if (!formData.heureDebut || !formData.prix || !formData.dateDebut || !formData.dateFin) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (new Date(formData.dateDebut) >= new Date(formData.dateFin)) {
      Alert.alert('Erreur', 'La date de fin doit être après la date de début');
      return;
    }

    setLoading(true);
    try {
      // Create one request per selected day
      for (const dayOfWeek of selectedDays) {
        await onSubmit({
          terrainId: selectedTerrain,
          dayOfWeek,
          heureDebut: formData.heureDebut,
          dureeMinutes: formData.dureeMinutes,
          prix: parseFloat(formData.prix),
          dateDebut: formData.dateDebut,
          dateFin: formData.dateFin,
        });
      }

      Alert.alert('Succès', `${selectedDays.length} série(s) de créneaux créée(s)`);
      onClose();

      // Reset form
      setSelectedDays([]);
      setFormData({
        heureDebut: '08:00',
        dureeMinutes: 60,
        prix: '1000',
        dateDebut: new Date().toISOString().split('T')[0],
        dateFin: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
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
          <Text style={styles.title}>Créneaux récurrents</Text>
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

          {/* Days of Week */}
          <View style={styles.field}>
            <Text style={styles.label}>Jours de la semaine *</Text>
            <View style={styles.daysContainer}>
              {DAYS_OF_WEEK.map((day) => (
                <TouchableOpacity
                  key={day.value}
                  style={[
                    styles.dayChip,
                    selectedDays.includes(day.value) && styles.dayChipActive,
                  ]}
                  onPress={() => toggleDay(day.value)}
                >
                  <Text
                    style={[
                      styles.dayChipText,
                      selectedDays.includes(day.value) && styles.dayChipTextActive,
                    ]}
                  >
                    {day.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Heure de début *"
            placeholder="HH:mm"
            value={formData.heureDebut}
            onChangeText={(text) => setFormData({ ...formData, heureDebut: text })}
            hint="Ex: 08:00"
          />

          {/* Duration */}
          <View style={styles.field}>
            <Text style={styles.label}>Durée *</Text>
            <View style={styles.chipsContainer}>
              {DURATIONS.map((duration) => (
                <TouchableOpacity
                  key={duration.value}
                  style={[
                    styles.chip,
                    formData.dureeMinutes === duration.value && styles.chipActive,
                  ]}
                  onPress={() => setFormData({ ...formData, dureeMinutes: duration.value })}
                >
                  <Text
                    style={[
                      styles.chipText,
                      formData.dureeMinutes === duration.value && styles.chipTextActive,
                    ]}
                  >
                    {duration.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Input
            label="Prix (Dzd) *"
            placeholder="1000"
            value={formData.prix}
            onChangeText={(text) => setFormData({ ...formData, prix: text })}
            keyboardType="numeric"
          />

          <View style={styles.dateRow}>
            <View style={styles.dateField}>
              <Input
                label="Date début *"
                placeholder="YYYY-MM-DD"
                value={formData.dateDebut}
                onChangeText={(text) => setFormData({ ...formData, dateDebut: text })}
              />
            </View>
            <View style={styles.dateField}>
              <Input
                label="Date fin *"
                placeholder="YYYY-MM-DD"
                value={formData.dateFin}
                onChangeText={(text) => setFormData({ ...formData, dateFin: text })}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color={colors.primary} />
            <Text style={styles.infoText}>
              Les créneaux seront créés chaque {selectedDays.length > 0 ? DAYS_OF_WEEK.filter(d => selectedDays.includes(d.value)).map(d => d.label).join(', ') : '(sélectionnez des jours)'} entre les dates choisies
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button onPress={handleSubmit} disabled={loading || selectedDays.length === 0} fullWidth>
            {loading ? 'Création...' : 'Créer les créneaux'}
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
  daysContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dayChip: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.text,
  },
  dayChipTextActive: {
    color: colors.white,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footer: {
    padding: 24,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
});
