import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

interface ClubDetailScreenProps {
  clubId: number;
  onBack: () => void;
  onReserve: (data: any) => void;
  onAboutClub: () => void;
}

const clubData = {
  1: {
    name: 'Hydra Sports Club',
    location: 'Hydra, Alger',
    phone: '0609837382',
    academy: 'Non renseigné',
    hours: 'Lun-Dim 08:00-23:00',
    image: 'https://images.unsplash.com/photo-1734652246537-104c43a68942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHN0YWRpdW0lMjBmaWVsZHxlbnwxfHx8fDE3NjY5Mjc4MzJ8MA&ixlib=rb-4.1.0&q=80&w=1080',
    sports: ['Football', 'Padel'],
    terrains: [
      {
        id: 1,
        name: 'Terrain 1',
        sport: 'Football',
        type: 'Synthétique',
        slots: [
          { time: '10h-11h (1h 30 mins)', price: '5000 DZD', period: 'matin', date: '2026-01-06' },
          { time: '14h-15h (1h 30 mins)', price: '5000 DZD', period: 'apres-midi', date: '2026-01-06' },
          { time: '18h-19h (1h 30 mins)', price: '6000 DZD', period: 'soir', date: '2026-01-06' },
          { time: '09h-10h (1h 30 mins)', price: '4500 DZD', period: 'matin', date: '2026-01-07' },
          { time: '19h-20h (1h 30 mins)', price: '6000 DZD', period: 'soir', date: '2026-01-07' }
        ]
      },
      {
        id: 2,
        name: 'Court Central',
        sport: 'Padel',
        type: 'Gazon artificiel',
        slots: [
          { time: '11h-12h (1h)', price: '4000 DZD', period: 'matin', date: '2026-01-06' },
          { time: '13h-14h (1h)', price: '4500 DZD', period: 'midi', date: '2026-01-06' },
          { time: '15h-16h (1h)', price: '4500 DZD', period: 'apres-midi', date: '2026-01-06' },
          { time: '20h-21h (1h)', price: '5000 DZD', period: 'soir', date: '2026-01-06' }
        ]
      }
    ]
  }
};

const generateDates = () => {
  const dates = [];
  const today = new Date('2026-01-03');

  for (let i = 0; i < 21; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push({
      value: date.toISOString().split('T')[0],
      label: date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
    });
  }

  return dates;
};

export function ClubDetailScreen({ clubId, onBack, onReserve, onAboutClub }: ClubDetailScreenProps) {
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>(new Date('2026-01-06').toISOString().split('T')[0]);

  const club = clubData[clubId as keyof typeof clubData] || clubData[1];
  const dates = generateDates();

  const periods = [
    { id: 'matin', label: 'Matin (~12h)', value: 'matin' },
    { id: 'midi', label: 'Midi (12h-14h)', value: 'midi' },
    { id: 'apres-midi', label: 'Après-midi (14h-18h)', value: 'apres-midi' },
    { id: 'soir', label: 'Soir (18h~)', value: 'soir' }
  ];

  const filteredTerrains = club.terrains.filter(terrain => {
    const sportMatch = selectedSport === 'all' || terrain.sport === selectedSport;
    return sportMatch;
  });

  return (
    <ScrollView style={styles.container}>
      {/* Header with Image */}
      <View style={styles.headerImageContainer}>
        <Image
          source={{ uri: club.image }}
          style={styles.headerImage}
          resizeMode="cover"
        />
        <View style={styles.headerOverlay} />

        {/* Back Button */}
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>

        {/* About Club Button */}
        <TouchableOpacity
          onPress={onAboutClub}
          style={styles.moreButton}
          activeOpacity={0.8}
        >
          <Ionicons name="ellipsis-vertical" size={24} color={colors.white} />
        </TouchableOpacity>

        {/* Club Info */}
        <View style={styles.clubInfo}>
          <Text style={styles.clubName}>{club.name}</Text>
          <View style={styles.locationRow}>
            <Ionicons name="location" size={16} color={colors.white} />
            <Text style={styles.locationText}>{club.location}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Informations Section */}
        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Text style={styles.infoEmoji}>ℹ️</Text>
            <Text style={styles.infoTitle}>Informations</Text>
          </View>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="call" size={16} color={colors.primaryDark} />
              <Text style={styles.infoText}>{club.phone}</Text>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location" size={16} color={colors.primaryDark} />
              <Text style={styles.infoText}>{club.location.split(',')[0]}</Text>
            </View>

            <View style={[styles.infoItem, styles.infoItemFull]}>
              <Ionicons name="time" size={16} color={colors.primaryDark} />
              <Text style={styles.infoText}>{club.hours}</Text>
            </View>
          </View>
        </View>

        {/* Date Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Choisir une date</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dateScroll}
          >
            {dates.map((date) => (
              <TouchableOpacity
                key={date.value}
                onPress={() => setSelectedDate(date.value)}
                style={[
                  styles.dateButton,
                  selectedDate === date.value && styles.dateButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.dateButtonText,
                  selectedDate === date.value && styles.dateButtonTextActive
                ]}>
                  {date.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Sport Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sport</Text>
          <View style={styles.selectContainer}>
            <Text style={styles.selectText}>
              {selectedSport === 'all' ? 'Tous les sports' : selectedSport}
            </Text>
            <Ionicons name="chevron-down" size={20} color={colors.text} />
          </View>
        </View>

        {/* Time Period Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Filtrer par moment de la journée</Text>
          <View style={styles.periodGrid}>
            {periods.map(period => (
              <TouchableOpacity
                key={period.id}
                onPress={() => setSelectedPeriod(selectedPeriod === period.value ? '' : period.value)}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.value && styles.periodButtonActive
                ]}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period.value && styles.periodButtonTextActive
                ]}>
                  {period.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Terrains List */}
        <View style={styles.terrainsSection}>
          {filteredTerrains.map(terrain => {
            const displaySlots = terrain.slots.filter(slot => {
              const dateMatch = slot.date === selectedDate;
              const periodMatch = !selectedPeriod || slot.period === selectedPeriod;
              return dateMatch && periodMatch;
            });

            if (displaySlots.length === 0) return null;

            return displaySlots.map((slot, idx) => (
              <View key={`${terrain.id}-${idx}`} style={styles.terrainCard}>
                <View style={styles.terrainImageContainer}>
                  <Image
                    source={{ uri: club.image }}
                    style={styles.terrainImage}
                    resizeMode="cover"
                  />
                  <View style={styles.terrainBadge}>
                    <Text style={styles.terrainBadgeText}>{terrain.name}</Text>
                  </View>
                </View>

                <View style={styles.terrainContent}>
                  <View style={styles.terrainHeader}>
                    <View>
                      <Text style={styles.terrainTime}>{slot.time}</Text>
                      <Text style={styles.terrainSport}>{terrain.sport}</Text>
                    </View>
                    <Text style={styles.terrainPrice}>{slot.price}</Text>
                  </View>

                  <Text style={styles.terrainType}>{terrain.type}</Text>

                  <Button
                    fullWidth
                    onPress={() => onReserve({
                      clubName: club.name,
                      terrainName: terrain.name,
                      date: dates.find(d => d.value === selectedDate)?.label || '',
                      time: slot.time,
                      price: slot.price
                    })}
                  >
                    Réserver
                  </Button>
                </View>
              </View>
            ));
          })}
        </View>

        {filteredTerrains.every(terrain =>
          terrain.slots.filter(slot => {
            const dateMatch = slot.date === selectedDate;
            const periodMatch = !selectedPeriod || slot.period === selectedPeriod;
            return dateMatch && periodMatch;
          }).length === 0
        ) && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>😅</Text>
            <Text style={styles.emptyTitle}>Aucun créneau disponible</Text>
            <Text style={styles.emptyText}>Essaye un autre filtre ou une autre date</Text>
          </View>
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
  headerImageContainer: {
    height: 256,
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  backButton: {
    position: 'absolute',
    top: 48,
    left: spacing.xxl,
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moreButton: {
    position: 'absolute',
    top: 48,
    right: spacing.xxl,
    width: 40,
    height: 40,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubInfo: {
    position: 'absolute',
    bottom: spacing.xxl,
    left: spacing.xxl,
    right: spacing.xxl,
  },
  clubName: {
    fontFamily: 'Poppins',
    fontWeight: '900',
    fontSize: 32,
    color: colors.white,
    marginBottom: 8,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    color: '#E5E7EB',
    fontSize: 15,
    fontWeight: '500',
  },
  content: {
    padding: spacing.xxl,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    ...shadows.soft,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  infoEmoji: {
    fontSize: 16,
  },
  infoTitle: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: 15,
    color: colors.text,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width: '48%',
  },
  infoItemFull: {
    width: '100%',
  },
  infoText: {
    fontSize: 12,
    color: colors.text,
    fontWeight: '600',
  },
  section: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: 16,
    color: colors.text,
    marginBottom: 12,
  },
  dateScroll: {
    gap: 12,
    paddingBottom: 8,
  },
  dateButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    minWidth: 140,
    alignItems: 'center',
  },
  dateButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  dateButtonText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 13,
    color: colors.textSecondary,
  },
  dateButtonTextActive: {
    color: colors.white,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
  },
  selectText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 15,
    color: colors.text,
  },
  periodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  periodButton: {
    flex: 1,
    minWidth: '48%',
    paddingHorizontal: spacing.lg,
    paddingVertical: 14,
    borderRadius: borderRadius.xxl,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  periodButtonActive: {
    backgroundColor: colors.primaryDark,
    borderColor: colors.primaryDark,
  },
  periodButtonText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: colors.textSecondary,
  },
  periodButtonTextActive: {
    color: colors.white,
  },
  terrainsSection: {
    gap: spacing.lg,
    marginBottom: spacing.xxl,
  },
  terrainCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.soft,
  },
  terrainImageContainer: {
    height: 160,
    position: 'relative',
  },
  terrainImage: {
    width: '100%',
    height: '100%',
  },
  terrainBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: borderRadius.xl,
  },
  terrainBadgeText: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 14,
    color: colors.text,
  },
  terrainContent: {
    padding: spacing.xl,
  },
  terrainHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  terrainTime: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: 18,
    color: colors.text,
    marginBottom: 4,
  },
  terrainSport: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  terrainPrice: {
    fontFamily: 'Poppins',
    fontWeight: '900',
    fontSize: 22,
    color: colors.primaryDark,
  },
  terrainType: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.lg,
  },
  emptyState: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 40,
    alignItems: 'center',
    ...shadows.soft,
  },
  emptyEmoji: {
    fontSize: 60,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
});
