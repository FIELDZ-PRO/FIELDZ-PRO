import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Reservation } from '../types';

interface ReservationDetailCardProps {
  reservation: Reservation;
  onConfirm?: (id: number) => void;
  onMarkAbsent?: (id: number) => void;
  onCancel?: (id: number) => void;
}

const STATUS_CONFIG = {
  RESERVE: { label: 'Réservée', color: colors.primary, icon: 'checkmark-circle' as const },
  CONFIRMEE: { label: 'Confirmée', color: colors.success, icon: 'checkmark-done-circle' as const },
  ABSENT: { label: 'Absent', color: colors.error, icon: 'close-circle' as const },
  ANNULE: { label: 'Annulée', color: colors.textMuted, icon: 'ban' as const },
  ANNULE_PAR_JOUEUR: { label: 'Annulée par joueur', color: colors.textMuted, icon: 'ban' as const },
  ANNULE_PAR_CLUB: { label: 'Annulée par club', color: colors.textMuted, icon: 'ban' as const },
  LIBRE: { label: 'Libre', color: colors.textSecondary, icon: 'time' as const },
};

export function ReservationDetailCard({ reservation, onConfirm, onMarkAbsent, onCancel }: ReservationDetailCardProps) {
  const status = STATUS_CONFIG[reservation.statut] || STATUS_CONFIG.RESERVE;
  const startTime = new Date(reservation.creneau.dateDebut).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(reservation.creneau.dateFin).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(reservation.creneau.dateDebut).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  });

  // Check if we can perform actions (15 minutes before start)
  const now = new Date();
  const creneauStart = new Date(reservation.creneau.dateDebut);
  const minutesUntilStart = (creneauStart.getTime() - now.getTime()) / (1000 * 60);
  const canPerformActions = minutesUntilStart <= 15 && minutesUntilStart >= -15;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.playerInfo}>
          <Text style={styles.playerName}>
            {reservation.joueur.prenom} {reservation.joueur.nom}
          </Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
          <Ionicons name={status.icon} size={16} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="business-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.detailText}>{reservation.creneau.terrain.nomTerrain}</Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {startTime} - {endTime}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.detailText}>{reservation.creneau.prix} Dzd</Text>
        </View>

        {reservation.joueur.telephone && (
          <View style={styles.detailItem}>
            <Ionicons name="call-outline" size={18} color={colors.textSecondary} />
            <Text style={styles.detailText}>{reservation.joueur.telephone}</Text>
          </View>
        )}
      </View>

      {/* Actions */}
      {canPerformActions && reservation.statut === 'RESERVE' && (
        <View style={styles.actions}>
          {onConfirm && (
            <TouchableOpacity
              style={[styles.actionButton, styles.confirmButton]}
              onPress={() => onConfirm(reservation.id)}
            >
              <Ionicons name="checkmark-circle" size={18} color={colors.white} />
              <Text style={styles.actionText}>Confirmer</Text>
            </TouchableOpacity>
          )}
          {onMarkAbsent && (
            <TouchableOpacity
              style={[styles.actionButton, styles.absentButton]}
              onPress={() => onMarkAbsent(reservation.id)}
            >
              <Ionicons name="close-circle" size={18} color={colors.white} />
              <Text style={styles.actionText}>Absent</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {canPerformActions && (reservation.statut === 'RESERVE' || reservation.statut === 'CONFIRMEE') && onCancel && (
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => onCancel(reservation.id)}
        >
          <Ionicons name="ban" size={18} color={colors.error} />
          <Text style={[styles.actionText, { color: colors.error }]}>Annuler</Text>
        </TouchableOpacity>
      )}

      {!canPerformActions && (
        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={16} color={colors.textMuted} />
          <Text style={styles.infoText}>
            Actions disponibles 15 min avant le début du créneau
          </Text>
        </View>
      )}
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
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
    textTransform: 'capitalize',
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
    gap: 8,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: colors.success,
  },
  absentButton: {
    backgroundColor: colors.error,
  },
  cancelButton: {
    backgroundColor: colors.errorBg,
    marginTop: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
  },
});
