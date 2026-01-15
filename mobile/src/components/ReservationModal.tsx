import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from './ui/Button';
import { borderRadius } from '../theme';

interface ReservationData {
  clubName: string;
  terrainName: string;
  date: string;
  time: string;
  price: string;
}

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  reservationData: ReservationData;
  loading?: boolean;
}

const DARK_BG_START = '#1A1A1A';
const DARK_BG_END = '#0B0B0B';
const GREEN_ACCENT = '#1ED760';
const WHITE_TEXT = '#FFFFFF';
const GRAY_TEXT = '#F2F4F7';
const WHITE_BORDER = 'rgba(255, 255, 255, 0.1)';
const WHITE_BG = 'rgba(255, 255, 255, 0.05)';

export function ReservationModal({
  isOpen,
  onClose,
  onConfirm,
  reservationData,
  loading = false,
}: ReservationModalProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <LinearGradient
                colors={[DARK_BG_START, DARK_BG_END]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.modal}
              >
                {/* Header */}
                <View style={styles.header}>
                  <Text style={styles.title}>Rejoindre le match</Text>
                  <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={20} color={WHITE_TEXT} />
                  </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <View style={styles.infoBox}>
                    {/* Club */}
                    <View style={styles.infoRow}>
                      <Ionicons name="location" size={20} color={GREEN_ACCENT} />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Match</Text>
                        <Text style={styles.infoValue}>{reservationData.clubName}</Text>
                        <Text style={styles.infoSubValue}>{reservationData.terrainName}</Text>
                      </View>
                    </View>

                    {/* Date */}
                    <View style={styles.infoRow}>
                      <Ionicons name="calendar-outline" size={20} color={GREEN_ACCENT} />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Date</Text>
                        <Text style={styles.infoValue}>{reservationData.date}</Text>
                      </View>
                    </View>

                    {/* Time */}
                    <View style={styles.infoRow}>
                      <Ionicons name="time-outline" size={20} color={GREEN_ACCENT} />
                      <View style={styles.infoContent}>
                        <Text style={styles.infoLabel}>Horaire</Text>
                        <Text style={styles.infoValue}>{reservationData.time}</Text>
                      </View>
                    </View>

                    {/* Price */}
                    <View style={styles.priceRow}>
                      <Ionicons name="cash-outline" size={20} color={GREEN_ACCENT} />
                      <View style={styles.priceContent}>
                        <Text style={styles.priceLabel}>Total</Text>
                        <Text style={styles.priceValue}>{reservationData.price}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.footer}>
                  <View style={styles.buttonRow}>
                    <View style={styles.buttonHalf}>
                      <Button variant="outline" fullWidth onPress={onClose}>
                        Annuler
                      </Button>
                    </View>
                    <View style={styles.buttonHalf}>
                      <Button fullWidth onPress={onConfirm} loading={loading}>
                        Confirmer →
                      </Button>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: WHITE_BORDER,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  modal: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: WHITE_BORDER,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: WHITE_TEXT,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  content: {
    padding: 24,
  },
  infoBox: {
    backgroundColor: WHITE_BG,
    borderRadius: borderRadius.xl,
    padding: 20,
    gap: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: GRAY_TEXT,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '700',
    color: WHITE_TEXT,
  },
  infoSubValue: {
    fontSize: 14,
    color: GRAY_TEXT,
    marginTop: 2,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: WHITE_BORDER,
  },
  priceContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: GRAY_TEXT,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: GREEN_ACCENT,
  },
  footer: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: WHITE_BORDER,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  buttonHalf: {
    flex: 1,
  },
});
