import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { getMyClub, updateClub } from '../../api/club';
import { Club } from '../../types';

const SPORTS_OPTIONS = ['PADEL', 'FOOTBALL', 'FOOT5', 'TENNIS', 'BASKET', 'HANDBALL', 'VOLLEY'];

export default function SettingsScreen() {
  const { logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [club, setClub] = useState<Club | null>(null);
  const [formData, setFormData] = useState({
    nom: '',
    ville: '',
    adresse: '',
    telephone: '',
    description: '',
    sports: [] as string[],
  });

  const fetchClub = useCallback(async () => {
    try {
      const data = await getMyClub();
      setClub(data);
      setFormData({
        nom: data.nom || data.nomClub || '',
        ville: data.ville || '',
        adresse: data.adresse || '',
        telephone: data.telephone || '',
        description: data.description || '',
        sports: data.sports || [],
      });
    } catch (error) {
      console.error('Failed to fetch club:', error);
      Alert.alert('Erreur', 'Impossible de charger les informations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchClub();
  }, [fetchClub]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchClub();
  };

  const toggleSport = (sport: string) => {
    if (formData.sports.includes(sport)) {
      setFormData({
        ...formData,
        sports: formData.sports.filter((s) => s !== sport),
      });
    } else {
      setFormData({
        ...formData,
        sports: [...formData.sports, sport],
      });
    }
  };

  const handleSave = async () => {
    if (!formData.nom.trim() || !formData.ville.trim()) {
      Alert.alert('Erreur', 'Le nom et la ville sont obligatoires');
      return;
    }

    setSaving(true);
    try {
      await updateClub({
        nom: formData.nom.trim(),
        ville: formData.ville.trim(),
        adresse: formData.adresse.trim(),
        telephone: formData.telephone.trim(),
        description: formData.description.trim(),
        sports: formData.sports,
      });
      await fetchClub();
      Alert.alert('Succès', 'Informations mises à jour');
    } catch (error: any) {
      const message = error.response?.data?.message || 'Une erreur est survenue';
      Alert.alert('Erreur', message);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Déconnexion',
        style: 'destructive',
        onPress: logout,
      },
    ]);
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
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Ionicons name="business" size={32} color={colors.white} />
          </View>
        </View>
        <Text style={styles.clubName}>{club?.nom || club?.nomClub || 'Votre Club'}</Text>
      </View>

      {/* Club Info Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations du club</Text>

        <Input
          label="Nom du club *"
          placeholder="Nom du club"
          value={formData.nom}
          onChangeText={(text) => setFormData({ ...formData, nom: text })}
        />

        <Input
          label="Ville *"
          placeholder="Alger"
          value={formData.ville}
          onChangeText={(text) => setFormData({ ...formData, ville: text })}
        />

        <Input
          label="Adresse"
          placeholder="Adresse complète"
          value={formData.adresse}
          onChangeText={(text) => setFormData({ ...formData, adresse: text })}
        />

        <Input
          label="Téléphone"
          placeholder="+213 XX XX XX XX"
          value={formData.telephone}
          onChangeText={(text) => setFormData({ ...formData, telephone: text })}
          keyboardType="phone-pad"
        />

        <Input
          label="Description"
          placeholder="Décrivez votre club..."
          value={formData.description}
          onChangeText={(text) => setFormData({ ...formData, description: text })}
          multiline
          numberOfLines={4}
        />
      </View>

      {/* Sports Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sports proposés</Text>
        <View style={styles.sportsContainer}>
          {SPORTS_OPTIONS.map((sport) => (
            <TouchableOpacity
              key={sport}
              style={[
                styles.sportChip,
                formData.sports.includes(sport) && styles.sportChipActive,
              ]}
              onPress={() => toggleSport(sport)}
            >
              <Text
                style={[
                  styles.sportChipText,
                  formData.sports.includes(sport) && styles.sportChipTextActive,
                ]}
              >
                {sport}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Save Button */}
      <View style={styles.section}>
        <Button onPress={handleSave} disabled={saving} fullWidth>
          {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </View>

      {/* Logout Button */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color={colors.error} />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>FIELDZ Club v1.0.0</Text>
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
    paddingBottom: 48,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primaryDark,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clubName: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.text,
  },
  section: {
    padding: 24,
    gap: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 4,
  },
  sportsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sportChipActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  sportChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  sportChipTextActive: {
    color: colors.white,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    backgroundColor: colors.errorBg,
    borderWidth: 1,
    borderColor: colors.error,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
