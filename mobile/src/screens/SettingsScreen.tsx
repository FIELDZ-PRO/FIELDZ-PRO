import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

type SettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Settings'>;

export function SettingsScreen() {
  const navigation = useNavigation<SettingsScreenNavigationProp>();

  const settingsItems = [
    {
      icon: 'notifications' as const,
      label: 'Notifications',
      description: 'Gérer les notifications',
      onClick: () => navigation.navigate('NotificationsSettings')
    },
    {
      icon: 'globe' as const,
      label: 'Langue',
      description: 'Français',
      onClick: () => console.log('Language settings - to be implemented')
    },
    {
      icon: 'lock-closed' as const,
      label: 'Mot de passe',
      description: 'Modifier le mot de passe',
      onClick: () => navigation.navigate('PasswordSettings')
    },
    {
      icon: 'document-text' as const,
      label: 'Confidentialité',
      description: 'Politique de confidentialité FIELDZ',
      onClick: () => navigation.navigate('Privacy')
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
          <Text style={styles.headerTitle}>Paramètres</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.settingsCard}>
          {settingsItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={item.onClick}
              style={[
                styles.settingItem,
                index !== settingsItems.length - 1 && styles.settingItemBorder
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Text style={styles.settingDescription}>{item.description}</Text>
              </View>
            </TouchableOpacity>
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    color: colors.text,
  },
  settingDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
