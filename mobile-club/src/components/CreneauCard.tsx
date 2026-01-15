import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';
import { Creneau } from '../types';

interface CreneauCardProps {
  creneau: Creneau;
}

const STATUS_CONFIG = {
  RESERVE: { label: 'Réservé', color: colors.primary, icon: 'checkmark-circle' as const },
  CONFIRMEE: { label: 'Confirmé', color: colors.success, icon: 'checkmark-done-circle' as const },
  LIBRE: { label: 'Libre', color: colors.textSecondary, icon: 'time' as const },
  ANNULE: { label: 'Annulé', color: colors.error, icon: 'close-circle' as const },
  ANNULE_PAR_JOUEUR: { label: 'Annulé', color: colors.error, icon: 'close-circle' as const },
  ANNULE_PAR_CLUB: { label: 'Annulé', color: colors.error, icon: 'close-circle' as const },
  ABSENT: { label: 'Absent', color: colors.warning, icon: 'alert-circle' as const },
};

export function CreneauCard({ creneau }: CreneauCardProps) {
  const status = STATUS_CONFIG[creneau.statut] || STATUS_CONFIG.LIBRE;
  const startTime = new Date(creneau.dateDebut).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const endTime = new Date(creneau.dateFin).toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const date = new Date(creneau.dateDebut).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.terrainInfo}>
          <Text style={styles.terrainName}>{creneau.terrain.nomTerrain}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${status.color}15` }]}>
          <Ionicons name={status.icon} size={16} color={status.color} />
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.details}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.detailText}>
            {startTime} - {endTime}
          </Text>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="cash-outline" size={18} color={colors.textSecondary} />
          <Text style={styles.detailText}>{creneau.prix} Dzd</Text>
        </View>

        {creneau.disponible ? (
          <View style={[styles.availableBadge, { backgroundColor: colors.successBg }]}>
            <Text style={[styles.availableText, { color: colors.success }]}>Disponible</Text>
          </View>
        ) : (
          <View style={[styles.availableBadge, { backgroundColor: colors.errorBg }]}>
            <Text style={[styles.availableText, { color: colors.error }]}>Occupé</Text>
          </View>
        )}
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
  terrainInfo: {
    flex: 1,
  },
  terrainName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  date: {
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
    alignItems: 'center',
    gap: 16,
    justifyContent: 'space-between',
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
  availableBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  availableText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
