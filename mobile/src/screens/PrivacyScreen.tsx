import React from 'react';
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
import { colors, spacing, typography, borderRadius, shadows } from '../theme';

type PrivacyScreenNavigationProp = NativeStackNavigationProp<MainStackParamList, 'Privacy'>;

export function PrivacyScreen() {
  const navigation = useNavigation<PrivacyScreenNavigationProp>();
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
          <Text style={styles.headerTitle}>Confidentialité</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          {/* Icon Header */}
          <View style={styles.iconContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="shield-checkmark" size={40} color={colors.white} />
            </View>
          </View>

          {/* Content Card */}
          <View style={styles.contentCard}>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Politique de Confidentialité FIELDZ</Text>
              <Text style={styles.date}>Dernière mise à jour : 2 Janvier 2026</Text>
            </View>

            <View style={styles.sections}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>1. Collecte des données</Text>
                <Text style={styles.sectionText}>
                  FIELDZ collecte uniquement les informations nécessaires au bon fonctionnement de l'application :
                  nom, prénom, email, numéro de téléphone et historique de réservations.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>2. Utilisation des données</Text>
                <Text style={styles.sectionText}>
                  Vos données sont utilisées exclusivement pour traiter vos réservations,
                  vous contacter en cas de besoin et améliorer nos services. Nous ne vendons
                  jamais vos données à des tiers.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>3. Sécurité</Text>
                <Text style={styles.sectionText}>
                  Vos données sont protégées par des systèmes de sécurité avancés.
                  Toutes les communications sont chiffrées et vos informations de paiement
                  ne sont jamais stockées sur nos serveurs.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>4. Vos droits</Text>
                <Text style={styles.sectionText}>
                  Vous avez le droit d'accéder, de modifier ou de supprimer vos données
                  personnelles à tout moment. Contactez-nous à privacy@fieldz.dz pour
                  exercer ces droits.
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionTitle}>5. Contact</Text>
                <Text style={styles.sectionText}>
                  Pour toute question concernant la confidentialité de vos données,
                  contactez-nous à support@fieldz.dz ou via l'application.
                </Text>
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.footer}>© 2026 FIELDZ • Cliki Tiri Marki 🎯</Text>
          </View>
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
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.full,
    backgroundColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentCard: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.soft,
  },
  titleSection: {
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    fontSize: 20,
    color: colors.text,
    marginBottom: 12,
  },
  date: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22.4,
  },
  sections: {
    gap: spacing.lg,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 16,
    color: colors.text,
  },
  sectionText: {
    color: '#374151',
    fontSize: 15,
    lineHeight: 25.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.lg,
  },
  footer: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
