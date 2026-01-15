import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../../components/Logo';
import { ClubCard } from '../../components/ClubCard';
import { Club } from '../../types';
import { getClubsByVille } from '../../api/reservations';
import { MainStackParamList } from '../../navigation/types';
import { colors } from '../../theme';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;

const SPORT_OPTIONS = ['Tous', 'Football', 'Padel', 'Tennis'];
const CITY_OPTIONS = ['Alger', 'Oran', 'Constantine'];

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1642506539297-6021bf65badc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBhY3Rpb24lMjBlbmVyZ3l8ZW58MXx8fHwxNzY3MzY3Mzc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1651043421470-88b023bb9636?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBhZXJpYWx8ZW58MXx8fHwxNzY3MzI1MDgwfDA&ixlib=rb-4.1.0&q=80&w=1080',
  'https://images.unsplash.com/photo-1760114852799-159fe9dccfa9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdGhsZXRlcyUyMHRyYWluaW5nfGVufDF8fHx8MTc2NzMzOTE1MHww&ixlib=rb-4.1.0&q=80&w=1080'
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [filteredClubs, setFilteredClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSport, setSelectedSport] = useState('Tous');
  const [selectedCity, setSelectedCity] = useState('Alger');
  const [showSportPicker, setShowSportPicker] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-rotate hero images
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchClubs = useCallback(async () => {
    try {
      const data = await getClubsByVille(selectedCity);
      setClubs(data);
      setFilteredClubs(data);
    } catch (error) {
      console.error('Failed to fetch clubs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [selectedCity]);

  useEffect(() => {
    fetchClubs();
  }, [fetchClubs]);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, selectedSport, selectedCity]);

  const handleSearch = () => {
    let result = clubs;

    // Filtre local par recherche textuelle
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (club) =>
          club.nomClub.toLowerCase().includes(query) ||
          club.ville?.toLowerCase().includes(query) ||
          club.adresse?.toLowerCase().includes(query)
      );
    }

    // Filtre local par sport
    if (selectedSport !== 'Tous') {
      result = result.filter((club) => club.sports?.includes(selectedSport));
    }

    // Note: Pas de filtre local par ville car déjà filtré au backend

    setFilteredClubs(result);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchClubs();
  };

  const handleViewSlots = (clubId: number) => {
    navigation.navigate('ClubDetail', { clubId });
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
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Hero Section with Background Carousel */}
        <View style={styles.heroContainer}>
          {/* Background Images Carousel */}
          {HERO_IMAGES.map((imageUri, index) => (
            <ImageBackground
              key={index}
              source={{ uri: imageUri }}
              style={[
                styles.heroImage,
                { opacity: index === currentImageIndex ? 1 : 0 }
              ]}
              resizeMode="cover"
            />
          ))}

          <LinearGradient
            colors={['rgba(0, 0, 0, 0.7)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)']}
            locations={[0, 0.5, 1]}
            style={styles.heroGradient}
          >
            <View style={styles.heroOverlay}>
              {/* Top Bar */}
              <View style={styles.heroHeader}>
                <TouchableOpacity style={styles.avatar}>
                  <Text style={styles.avatarText}>F</Text>
                </TouchableOpacity>

                <Logo size="sm" variant="light" />

                <TouchableOpacity style={styles.avatar}>
                  <Text style={styles.avatarText}>A</Text>
                </TouchableOpacity>
              </View>

              {/* Hero Content */}
              <View style={styles.heroContent}>
                <View style={styles.tagContainer}>
                  <Ionicons name="flash" size={20} color={colors.primary} />
                  <Text style={styles.tagText}>JOUE MAINTENANT</Text>
                </View>

                <Text style={styles.heroTitle}>
                  TROUVE TON{'\n'}PROCHAIN DÉFI
                </Text>

                <Text style={styles.heroSubtitle}>
                  Réserve un terrain dans un club près de toi
                </Text>

                {/* Search Bar */}
                <View style={styles.searchInput}>
                  <TextInput
                    placeholder="🔍 Rechercher un club..."
                    placeholderTextColor={colors.textSecondary}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={styles.searchText}
                  />
                </View>

                {/* Filters */}
                <View style={styles.filtersRow}>
                  <TouchableOpacity
                    style={styles.filterButtonGreen}
                    onPress={() => setShowSportPicker(!showSportPicker)}
                  >
                    <Text style={styles.filterButtonTextWhite}>{selectedSport}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.filterButtonGreen}
                    onPress={() => setShowCityPicker(!showCityPicker)}
                  >
                    <Text style={styles.filterButtonTextWhite}>{selectedCity}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Clubs Section */}
        <View style={styles.clubsSection}>
          <Text style={styles.sectionTitle}>Clubs disponibles</Text>

          {filteredClubs.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Ionicons name="business-outline" size={64} color={colors.border} />
              <Text style={styles.emptyText}>Aucun club trouvé</Text>
            </View>
          ) : (
            <View style={styles.clubsList}>
              {filteredClubs.map((club) => (
                <ClubCard
                  key={club.id}
                  id={club.id}
                  name={club.nomClub}
                  location={club.ville || club.adresse || 'Algérie'}
                  sports={club.sports || []}
                  nextAvailable="Aujourd'hui 18:00"
                  image={club.images?.[0]?.imageUrl}
                  onViewSlots={() => handleViewSlots(club.id)}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Sport Picker Modal */}
      <Modal
        visible={showSportPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSportPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSportPicker(false)}
        >
          <View style={styles.pickerModal}>
            {SPORT_OPTIONS.map((sport) => (
              <TouchableOpacity
                key={sport}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedSport(sport);
                  setShowSportPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selectedSport === sport && styles.pickerItemTextActive,
                  ]}
                >
                  {sport}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* City Picker Modal */}
      <Modal
        visible={showCityPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowCityPicker(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCityPicker(false)}
        >
          <View style={styles.pickerModal}>
            {CITY_OPTIONS.map((city) => (
              <TouchableOpacity
                key={city}
                style={styles.pickerItem}
                onPress={() => {
                  setSelectedCity(city);
                  setShowCityPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.pickerItemText,
                    selectedCity === city && styles.pickerItemTextActive,
                  ]}
                >
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroContainer: {
    height: 450,
    position: 'relative',
  },
  heroImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    flex: 1,
    padding: 24,
    paddingTop: 24,
    justifyContent: 'space-between',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 24,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 18,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  heroContent: {
    gap: 12,
  },
  tagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  tagText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.5,
  },
  heroTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.76,
    lineHeight: 42,
    textTransform: 'uppercase',
  },
  heroSubtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E5E7EB',
  },
  searchInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  searchText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
    paddingVertical: 6,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 12,
  },
  filterButtonGreen: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  filterButtonTextWhite: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  pickerModal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxWidth: 300,
    overflow: 'hidden',
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  pickerItemTextActive: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  clubsSection: {
    paddingHorizontal: 24,
    paddingVertical: 24,
    paddingBottom: 100,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  clubsList: {
    gap: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptyText: {
    fontSize: 18,
    color: colors.textSecondary,
    fontWeight: '600',
  },
});
