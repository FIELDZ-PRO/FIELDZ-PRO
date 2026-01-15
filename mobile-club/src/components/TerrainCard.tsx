import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Terrain } from '../types';

interface TerrainCardProps {
  terrain: Terrain;
}

const SPORT_ICONS = {
  PADEL: 'tennisball' as const,
  FOOTBALL: 'football' as const,
  FOOT5: 'football' as const,
  TENNIS: 'tennisball' as const,
  BASKET: 'basketball' as const,
};

export function TerrainCard({ terrain }: TerrainCardProps) {
  const sportIcon = SPORT_ICONS[terrain.sport as keyof typeof SPORT_ICONS] || 'football';

  return (
    <View style={styles.container}>
      {terrain.photo ? (
        <Image source={{ uri: terrain.photo }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={styles.placeholderImage}>
          <Ionicons name={sportIcon} size={32} color={colors.textMuted} />
        </View>
      )}

      <View style={styles.content}>
        <Text style={styles.name}>{terrain.nomTerrain}</Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Ionicons name={sportIcon} size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{terrain.sport}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="leaf-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{terrain.typeSurface}</Text>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="location-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.detailText}>{terrain.ville}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 120,
  },
  placeholderImage: {
    width: '100%',
    height: 120,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  details: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
