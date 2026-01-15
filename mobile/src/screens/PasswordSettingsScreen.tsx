import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from '../navigation/types';
import { Button } from '../components/ui/Button';
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

type PasswordSettingsScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'PasswordSettings'>;

export function PasswordSettingsScreen() {
  const navigation = useNavigation<PasswordSettingsScreenNavigationProp>();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = () => {
    console.log('Password change submitted');
  };

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
          <Text style={styles.headerTitle}>Mot de passe</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.formCard}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe actuel</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>••••••••</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nouveau mot de passe</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>••••••••</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmer le nouveau mot de passe</Text>
              <View style={styles.input}>
                <Text style={styles.inputText}>••••••••</Text>
              </View>
            </View>
          </View>

          <Button fullWidth onPress={handleSubmit}>
            Modifier le mot de passe
          </Button>
        </View>
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
    fontSize: 28,
    letterSpacing: -0.56,
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: spacing.xxl,
    gap: spacing.xxl,
  },
  formCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    gap: spacing.lg,
    ...shadows.soft,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 14,
    color: colors.textSecondary,
  },
  input: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.xxl,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
  },
  inputText: {
    fontFamily: 'Poppins',
    fontWeight: '600',
    fontSize: 16,
    color: colors.text,
  },
});
