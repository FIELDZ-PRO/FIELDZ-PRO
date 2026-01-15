import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Linking,
  Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { MainStackParamList } from '../../navigation/types';
import { Club, Creneau } from '../../types';
import { getClubById, getClubCreneaux, createReservation } from '../../api/reservations';
import { ReservationModal } from '../../components/ReservationModal';
import { Button } from '../../components/ui/Button';
import { colors, borderRadius, shadows } from '../../theme';

type NavigationProp = NativeStackNavigationProp<MainStackParamList>;
type ClubDetailRouteProp = RouteProp<MainStackParamList, 'ClubDetail'>;

export default function ClubDetailScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<ClubDetailRouteProp>();
  const { clubId } = route.params;

  const [club, setClub] = useState<Club | null>(null);
  const [creneaux, setCreneaux] = useState<Creneau[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCreneau, setSelectedCreneau] = useState<Creneau | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const [clubData, creneauxData] = await Promise.all([
        getClubById(clubId),
        getClubCreneaux(clubId),
      ]);
      setClub(clubData);
      setCreneaux(creneauxData.filter(c => c.disponible));
    } catch (error) {
      console.error('Failed to fetch club data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [clubId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const months = ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aou', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]} ${date.getDate()} ${months[date.getMonth()]}`;
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleBookSlot = (creneau: Creneau) => {
    setSelectedCreneau(creneau);
    setModalVisible(true);
  };

  const handleConfirmBooking = async () => {
    if (!selectedCreneau) return;

    setBookingLoading(true);
    try {
      await createReservation(selectedCreneau.id);
      Alert.alert(
        'Reservation confirmee',
        'Votre reservation a ete effectuee avec succes !',
        [
          {
            text: 'OK',
            onPress: () => {
              setModalVisible(false);
              setSelectedCreneau(null);
              fetchData();
            },
          },
        ]
      );
    } catch (error: any) {
      Alert.alert(
        'Erreur',
        error.response?.data?.message || 'Impossible de reserver ce creneau'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  const handleOpenLocation = () => {
    if (club?.locationLink) {
      Linking.openURL(club.locationLink);
    } else if (club?.adresse) {
      const encodedAddress = encodeURIComponent(club.adresse);
      Linking.openURL(`https://maps.google.com/?q=${encodedAddress}`);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!club) {
    return (
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle-outline" size={64} color={colors.textMuted} />
        <Text style={styles.errorText}>Club non trouve</Text>
        <Button onPress={() => navigation.goBack()}>Retour</Button>
      </View>
    );
  }

  const clubImage = club.images?.[0]?.imageUrl;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Image with Back Button */}
        <View style={styles.imageContainer}>
          {clubImage ? (
            <Image source={{ uri: clubImage }} style={styles.image} />
          ) : (
            <LinearGradient
              colors={[colors.primary, colors.primaryHover]}
              style={styles.imagePlaceholder}
            >
              <Ionicons name="business" size={48} color={colors.white} />
            </LinearGradient>
          )}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        </View>

        {/* Club Info */}
        <View style={styles.content}>
          <View style={styles.clubInfo}>
            <Text style={styles.clubName}>{club.nomClub}</Text>

            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={20} color={colors.textSecondary} />
              <View style={styles.locationContent}>
                <Text style={styles.locationText}>
                  {club.adresse || club.ville || 'Adresse non disponible'}
                </Text>
                {(club.locationLink || club.adresse) && (
                  <TouchableOpacity
                    style={styles.mapLink}
                    onPress={handleOpenLocation}
                  >
                    <Text style={styles.mapLinkText}>Voir sur la carte</Text>
                    <Ionicons name="open-outline" size={12} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Sport Badges */}
            {club.sports && club.sports.length > 0 && (
              <View style={styles.sportBadges}>
                {club.sports.map((sport, index) => (
                  <View key={index} style={styles.sportBadge}>
                    <Text style={styles.sportText}>{sport}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Available Slots */}
          <View style={styles.slotsSection}>
            <Text style={styles.sectionTitle}>Creneaux disponibles</Text>

            {creneaux.length === 0 ? (
              <View style={styles.emptySlots}>
                <Ionicons name="calendar-outline" size={48} color={colors.textMuted} />
                <Text style={styles.emptySlotsText}>Aucun creneau disponible</Text>
              </View>
            ) : (
              <View style={styles.slotsList}>
                {creneaux.map((creneau) => (
                  <View key={creneau.id} style={styles.slotCard}>
                    <View style={styles.slotInfo}>
                      <View style={styles.slotDateRow}>
                        <Ionicons
                          name="calendar-outline"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.slotDate}>
                          {formatDate(creneau.dateDebut)}
                        </Text>
                      </View>
                      <View style={styles.slotTimeRow}>
                        <Ionicons
                          name="time-outline"
                          size={16}
                          color={colors.textSecondary}
                        />
                        <Text style={styles.slotTime}>
                          {formatTime(creneau.dateDebut)} - {formatTime(creneau.dateFin)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.slotAction}>
                      <Text style={styles.slotPrice}>{creneau.prix} DA</Text>
                      <Button
                        onPress={() => handleBookSlot(creneau)}
                      >
                        Reserver
                      </Button>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Reservation Modal */}
      {selectedCreneau && (
        <ReservationModal
          isOpen={modalVisible}
          onClose={() => {
            setModalVisible(false);
            setSelectedCreneau(null);
          }}
          onConfirm={handleConfirmBooking}
          loading={bookingLoading}
          reservationData={{
            clubName: club.nomClub,
            terrainName: selectedCreneau.terrain.nomTerrain,
            date: formatDate(selectedCreneau.dateDebut),
            time: `${formatTime(selectedCreneau.dateDebut)} - ${formatTime(selectedCreneau.dateFin)}`,
            price: `${selectedCreneau.prix} DA`,
          }}
        />
      )}
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
  errorContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 24,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 256,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.lg,
  },
  content: {
    padding: 24,
    paddingBottom: 100,
  },
  clubInfo: {
    marginBottom: 24,
  },
  clubName: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginBottom: 16,
  },
  locationContent: {
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mapLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  mapLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  sportBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sportBadge: {
    backgroundColor: colors.white,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sportText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  slotsSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  emptySlots: {
    alignItems: 'center',
    paddingVertical: 48,
    gap: 12,
  },
  emptySlotsText: {
    fontSize: 16,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  slotsList: {
    gap: 12,
  },
  slotCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  slotInfo: {
    gap: 8,
  },
  slotDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotDate: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  slotTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  slotTime: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  slotAction: {
    alignItems: 'flex-end',
    gap: 8,
  },
  slotPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
});
