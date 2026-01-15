import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

type NotificationsSettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'NotificationsSettings'>;

export function NotificationsSettingsScreen() {
  const navigation = useNavigation<NotificationsSettingsScreenNavigationProp>();
  const [notifications, setNotifications] = useState({
    reservations: true,
    matchUpdates: true,
    newsEvents: false,
    marketing: false
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const notificationItems = [
    {
      key: 'reservations' as const,
      label: 'Réservations',
      description: 'Confirmations et rappels de réservation'
    },
    {
      key: 'matchUpdates' as const,
      label: 'Matchs',
      description: 'Nouveaux joueurs et mises à jour de matchs'
    },
    {
      key: 'newsEvents' as const,
      label: 'News & Événements',
      description: 'Nouveautés et événements FIELDZ'
    },
    {
      key: 'marketing' as const,
      label: 'Promotions',
      description: 'Offres spéciales et promotions'
    }
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.settingsCard}>
          {notificationItems.map((item, index) => (
            <View
              key={item.key}
              style={[
                styles.notificationItem,
                index !== notificationItems.length - 1 && styles.notificationItemBorder
              ]}
            >
              <View style={styles.notificationText}>
                <Text style={styles.notificationLabel}>{item.label}</Text>
                <Text style={styles.notificationDescription}>{item.description}</Text>
              </View>

              {/* Toggle Switch */}
              <TouchableOpacity
                onPress={() => toggleNotification(item.key)}
                style={[
                  styles.toggle,
                  notifications[item.key] && styles.toggleActive
                ]}
                activeOpacity={0.8}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    notifications[item.key] && styles.toggleThumbActive
                  ]}
                />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    paddingHorizontal: spacing.xxl,
    paddingVertical: spacing.xxl,
    paddingTop: 48,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: 'Poppins',
    fontWeight: '900',
    fontSize: 32,
    letterSpacing: -0.64,
    color: colors.text,
  },
  content: {
    padding: spacing.xxl,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.soft,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.lg,
  },
  notificationItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  notificationText: {
    flex: 1,
    marginRight: spacing.lg,
  },
  notificationLabel: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    color: colors.text,
  },
  notificationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  toggle: {
    width: 48,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.border,
    padding: 4,
    justifyContent: 'center',
  },
  toggleActive: {
    backgroundColor: colors.primaryDark,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.white,
    transform: [{ translateX: 0 }],
  },
  toggleThumbActive: {
    transform: [{ translateX: 20 }],
  },
});
