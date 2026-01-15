import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, borderRadius } from '../theme';

interface MatchCardProps {
  id: number;
  sport: string;
  location: string;
  time: string;
  date: string;
  playersJoined: number;
  playersNeeded: number;
  level: string;
  price: string;
  onJoin: () => void;
}

export function MatchCard({
  sport,
  location,
  time,
  date,
  playersJoined,
  playersNeeded,
  level,
  price,
  onJoin,
}: MatchCardProps) {
  const spotsLeft = playersNeeded - playersJoined;
  const isFilling = spotsLeft <= 2;

  const getLevelColor = (lvl: string) => {
    switch (lvl) {
      case 'A':
        return { bg: 'rgba(234, 179, 8, 0.2)', text: '#EAB308' };
      case 'B':
        return { bg: 'rgba(59, 130, 246, 0.2)', text: '#3B82F6' };
      case 'C':
        return { bg: 'rgba(168, 85, 247, 0.2)', text: '#A855F7' };
      default:
        return { bg: 'rgba(255, 255, 255, 0.1)', text: '#FFFFFF' };
    }
  };

  const levelColors = getLevelColor(level);

  return (
    <TouchableOpacity onPress={onJoin} activeOpacity={0.8}>
      <LinearGradient
        colors={
          isFilling
            ? ['rgba(30, 215, 96, 0.1)', 'rgba(255, 255, 255, 0.05)']
            : ['rgba(255, 255, 255, 0.1)', 'rgba(255, 255, 255, 0.05)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.sportBadge}>
              <Text style={styles.sportText}>{sport}</Text>
            </View>
            <View style={[styles.levelBadge, { backgroundColor: levelColors.bg }]}>
              <Text style={[styles.levelText, { color: levelColors.text }]}>
                NIV. {level}
              </Text>
            </View>
          </View>

          {isFilling && (
            <View style={styles.fillingBadge}>
              <Ionicons name="flash" size={12} color={colors.black} />
              <Text style={styles.fillingText}>SE REMPLIT</Text>
            </View>
          )}
        </View>

        <Text style={styles.title}>Match {sport}</Text>

        {/* Info */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Ionicons name="location-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>{location}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
            <Text style={styles.infoText}>
              {date} • {time}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="people-outline" size={16} color={colors.primary} />
            <Text style={styles.playersText}>
              {playersJoined}/{playersNeeded} joueurs • {spotsLeft} place
              {spotsLeft > 1 ? 's' : ''} restante{spotsLeft > 1 ? 's' : ''}
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.price}>{price}</Text>
          <View style={styles.joinButton}>
            <Text style={styles.joinButtonText}>Rejoindre →</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.xl,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  sportBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  sportText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.black,
  },
  levelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  levelText: {
    fontSize: 12,
    fontWeight: '700',
  },
  fillingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
  },
  fillingText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.black,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 16,
  },
  infoSection: {
    gap: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  playersText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.text,
  },
  joinButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: borderRadius.md,
  },
  joinButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.black,
  },
});
