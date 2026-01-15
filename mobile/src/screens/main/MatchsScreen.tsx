import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ReservationCard } from '../../components/ReservationCard';
import { colors, borderRadius } from '../../theme';

const mockReservations = {
  upcoming: [
    {
      id: 1,
      clubName: 'Hydra Sports Club',
      terrainName: 'Terrain A',
      date: 'Lun 23 Déc 2024',
      time: '18:00 - 19:00',
      status: 'confirmed' as const,
    },
    {
      id: 2,
      clubName: 'Ben Aknoun Elite',
      terrainName: 'Court Central',
      date: 'Mer 25 Déc 2024',
      time: '20:00 - 21:00',
      status: 'pending' as const,
    },
  ],
  past: [
    {
      id: 3,
      clubName: 'Chéraga Stadium',
      terrainName: 'Terrain B',
      date: 'Dim 15 Déc 2024',
      time: '16:00 - 17:00',
      status: 'confirmed' as const,
    },
  ],
};

export default function MatchsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const tabs = [
    { id: 'upcoming' as const, label: 'À venir' },
    { id: 'past' as const, label: 'Passées' },
  ];

  const currentReservations = mockReservations[activeTab];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Mes Réservations</Text>
        <Text style={styles.subtitle}>Tes créneaux réservés</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[styles.tab, activeTab === tab.id && styles.tabActive]}
            >
              <Text
                style={[styles.tabText, activeTab === tab.id && styles.tabTextActive]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Reservations List */}
        {currentReservations.length > 0 ? (
          <View style={styles.reservationsList}>
            {currentReservations.map((reservation) => (
              <ReservationCard
                key={reservation.id}
                {...reservation}
                onCancel={
                  activeTab === 'upcoming'
                    ? () => console.log('Cancel', reservation.id)
                    : undefined
                }
              />
            ))}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="calendar-outline" size={64} color={colors.border} />
            <Text style={styles.emptyTitle}>
              Aucune réservation {activeTab === 'upcoming' ? 'à venir' : 'passée'}
            </Text>
            <Text style={styles.emptySubtitle}>
              C'est le moment de réserver un terrain! 🎾
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
    letterSpacing: -0.64,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  tabsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 24,
  },
  tab: {
    paddingBottom: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: colors.primaryDark,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.primaryDark,
  },
  reservationsList: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 24,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  emptySubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
});
