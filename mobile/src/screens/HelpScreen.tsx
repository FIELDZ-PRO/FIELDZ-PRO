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

type HelpScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Help'>;

export function HelpScreen() {
  const navigation = useNavigation<HelpScreenNavigationProp>();
  const helpItems = [
    {
      icon: 'book' as const,
      label: 'FAQ',
      description: 'Questions fréquemment posées'
    },
    {
      icon: 'chatbubble' as const,
      label: 'Contacter le support',
      description: 'support@fieldz.dz'
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
          <Text style={styles.headerTitle}>Aide & Support</Text>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.helpCard}>
          {helpItems.map((item, index) => (
            <TouchableOpacity
              key={item.label}
              onPress={() => console.log(item.label)}
              style={[
                styles.helpItem,
                index !== helpItems.length - 1 && styles.helpItemBorder
              ]}
              activeOpacity={0.7}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={item.icon} size={20} color={colors.primaryDark} />
              </View>
              <View style={styles.helpText}>
                <Text style={styles.helpLabel}>{item.label}</Text>
                <Text style={styles.helpDescription}>{item.description}</Text>
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
  helpCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...shadows.soft,
  },
  helpItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.lg,
    padding: spacing.lg,
  },
  helpItemBorder: {
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
  helpText: {
    flex: 1,
  },
  helpLabel: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
    color: colors.text,
  },
  helpDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});
