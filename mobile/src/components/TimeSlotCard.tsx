import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button } from './ui/Button';
import { colors, borderRadius } from '../theme';

interface TimeSlotCardProps {
  date: string;
  timeRange: string;
  price: string;
  onBook: () => void;
  isBooked?: boolean;
}

export function TimeSlotCard({ date, timeRange, price, onBook, isBooked = false }: TimeSlotCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.row}>
          <Ionicons name="calendar-outline" size={16} color="#6B7280" />
          <Text style={styles.dateText}>{date}</Text>
        </View>
        <View style={styles.row}>
          <Ionicons name="time-outline" size={16} color="#6B7280" />
          <Text style={styles.timeText}>{timeRange}</Text>
        </View>
      </View>

      <View style={styles.rightContent}>
        <Text style={styles.price}>{price}</Text>
        <Button
          onPress={onBook}
          disabled={isBooked}
          style={styles.button}
        >
          {isBooked ? 'Reserve' : 'Reserver'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  leftContent: {
    gap: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  rightContent: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
});
