import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { login as loginApi } from '../../api/auth';

const DEV_AUTO_LOGIN = process.env.EXPO_PUBLIC_DEV_AUTO_LOGIN === 'true';
const DEV_EMAIL = process.env.EXPO_PUBLIC_DEV_EMAIL || '';
const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_PASSWORD || '';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState(DEV_AUTO_LOGIN ? DEV_EMAIL : '');
  const [password, setPassword] = useState(DEV_AUTO_LOGIN ? DEV_PASSWORD : '');
  const [loading, setLoading] = useState(false);

  // Auto-login en mode DEV au montage du composant
  useEffect(() => {
    if (DEV_AUTO_LOGIN && DEV_EMAIL && DEV_PASSWORD) {
      console.log('🔧 DEV MODE: Auto-login activé');
      handleSubmit();
    }
  }, []);

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);
    try {
      const token = await loginApi({ email, password });
      await login(token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Échec de la connexion';
      Alert.alert('Erreur', message);
    } finally {
      setLoading(false);
    }
  };

  const handleDevLogin = () => {
    setEmail(DEV_EMAIL);
    setPassword(DEV_PASSWORD);
    setTimeout(() => handleSubmit(), 100);
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
        <Text style={styles.title}>FIELDZ Club</Text>
        <Text style={styles.subtitle}>Connectez-vous pour gérer votre club</Text>
      </View>

      {/* Form */}
      <View style={styles.formContainer}>
        <Input
          label="Email"
          placeholder="exemple@email.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <Input
          label="Mot de passe"
          placeholder="Entrez votre mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View style={styles.submitButtonContainer}>
          <Button fullWidth onPress={handleSubmit} disabled={loading}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </Button>

          {/* Bouton DEV LOGIN - visible seulement en mode dev */}
          {DEV_EMAIL && DEV_PASSWORD && !DEV_AUTO_LOGIN && (
            <TouchableOpacity
              style={styles.devButton}
              onPress={handleDevLogin}
              disabled={loading}
            >
              <Text style={styles.devButtonText}>🔧 DEV LOGIN ({DEV_EMAIL})</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingBottom: 32,
  },
  logoContainer: {
    marginBottom: 48,
    alignItems: 'center',
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
    gap: 12,
  },
  devButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#FFF3CD',
    borderWidth: 1,
    borderColor: '#FFECB5',
    alignItems: 'center',
  },
  devButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
});
