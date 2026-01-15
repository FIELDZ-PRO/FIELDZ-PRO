import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { register as registerApi, login as loginApi } from '../../api/auth';

interface RegisterScreenProps {
  onSwitchToLogin: () => void;
}

export default function RegisterScreen({ onSwitchToLogin }: RegisterScreenProps) {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '+213',  // Indicatif Algérie par défaut
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    // Construction du nom complet (backend FIELDZ n'a qu'un champ "nom")
    const nomComplet = formData.prenom
      ? `${formData.prenom} ${formData.nom}`.trim()
      : formData.nom.trim();

    if (!formData.nom || !formData.email || !formData.telephone || !formData.password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (formData.telephone.length < 12) {  // Ex: +213123456789
      Alert.alert('Erreur', 'Numéro de téléphone invalide');
      return;
    }

    setLoading(true);
    try {
      // Étape 1: Inscription (ne retourne pas de token selon le système FIELDZ)
      await registerApi({
        nom: nomComplet,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
      });

      // Étape 2: Connexion automatique après inscription réussie
      const token = await loginApi({
        email: formData.email,
        password: formData.password,
      });

      await login(token);
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || "Échec de l'inscription";
      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo size="md" variant="dark" />
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>À toi de jouer! ⚽</Text>
        <Text style={styles.subtitle}>Crée ton compte et trouve ton terrain</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Input
          label="Prénom"
          placeholder="Prénom"
          value={formData.prenom}
          onChangeText={(text) => setFormData({ ...formData, prenom: text })}
        />

        <Input
          label="Nom"
          placeholder="Nom"
          value={formData.nom}
          onChangeText={(text) => setFormData({ ...formData, nom: text })}
        />

        <Input
          label="Email"
          placeholder="exemple@email.com"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Téléphone"
          placeholder="555 12 34 56"
          value={formData.telephone}
          onChangeText={(text) => setFormData({ ...formData, telephone: text })}
          keyboardType="phone-pad"
          hint="Format: 555 12 34 56"
        />

        <Input
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
        />

        <Input
          label="Confirmer le mot de passe"
          placeholder="Confirmez votre mot de passe"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
        />

        <View style={styles.submitButtonContainer}>
          <Button fullWidth onPress={handleSubmit} disabled={loading}>
            {loading ? 'Création...' : 'Créer mon compte'}
          </Button>
        </View>
      </View>

      {/* Switch to Login */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Déjà un compte? </Text>
        <TouchableOpacity onPress={onSwitchToLogin} activeOpacity={0.7}>
          <Text style={styles.switchLink}>Connecte-toi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  contentContainer: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 96,
  },
  logoContainer: {
    marginBottom: 48,
  },
  headerContainer: {
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.72,
    color: colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  formContainer: {
    gap: 20,
  },
  submitButtonContainer: {
    paddingTop: 16,
  },
  switchContainer: {
    marginTop: 32,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  switchText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  switchLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
  },
});
