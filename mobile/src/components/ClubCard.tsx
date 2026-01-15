import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/Button';
import { ClubCarousel } from './ClubCarousel';
import { colors, shadows } from '../theme';

interface ClubCardProps {
  id: number;
  name: string;
  location: string;
  sports?: string[];
  nextAvailable?: string;
  image?: string;
  onViewSlots: () => void;
}

export function ClubCard({
  name,
  location,
  sports = [],
  nextAvailable,
  image,
  onViewSlots,
}: ClubCardProps) {
  const displayImages = image ? [image] : [];

  return (
    <View style={styles.card}>
      {/* Image Carousel */}
      <View style={styles.imageContainer}>
        <ClubCarousel images={displayImages} clubName={name} />
        {/* Sports Badges on top right */}
        <View style={styles.sportBadgesContainer}>
          {sports.slice(0, 2).map((sport, i) => (
            <View key={i} style={styles.sportBadge}>
              <Text style={styles.sportText}>{sport}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>

        {/* Location */}
        <View style={styles.row}>
          <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.location}>{location}</Text>
        </View>

        {/* Next Available */}
        {nextAvailable && (
          <View style={styles.row}>
            <Ionicons name="time-outline" size={16} color={colors.primary} />
            <Text style={styles.nextAvailable}>Prochain créneau: {nextAvailable}</Text>
          </View>
        )}

        <Button fullWidth onPress={onViewSlots}>
          Voir les créneaux
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  imageContainer: {
    position: 'relative',
  },
  sportBadgesContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    gap: 8,
    zIndex: 10,
  },
  sportBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  content: {
    padding: 20,
    gap: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  location: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  nextAvailable: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
