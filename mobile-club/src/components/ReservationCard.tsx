import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Reservation } from '../types';

interface ReservationCardProps {
  reservation: Reservation;
}

const STATUS_CONFIG = {
  RESERVE: { label: 'Réservée', color: colors.primary, icon: 'checkmark-circle' as const },
  CONFIRMEE: { label: 'Confirmée', color: colors.success, icon: 'checkmark-done-circle' as const },
  ABSENT: { label: 'Absent', color: colors.error, icon: 'close-circle' as const },
  ANNULE: { label: 'Annulée', color: colors.textMuted, icon: 'ban' as const },
  ANNULE_PAR_JOUEUR: { label: 'Annulée', color: colors.textMuted, icon: 'ban' as const },
  ANNULE_PAR_CLUB: { label: 'Annulée', color: colors.textMuted, icon: 'ban' as const },
  LIBRE: { label: 'Libre', color: colors.textSecondary, icon: 'time' as const },
};

export function ReservationCard({ reservation }: ReservationCardProps) {
  const status = STATUS_CONFIG[reservation.statut] || STATUS_CONFIG.RESERVE;
  const startTime = new Date(reservation.creneau.dateDebut).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(reservation.creneau.dateFin).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.playerName}>
            {reservation.joueur.prenom} {reservation.joueur.nom}
          </Text>
          <Text style={styles.terrainName}>{reservation.creneau.terrain.nomTerrain}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
          <Ionicons name={status.icon} size={16} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {startTime} - {endTime}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={16} color={colors.textSecondary} />
          <Text style={styles.detailText}>{reservation.creneau.prix} Dzd</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  terrainName: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
