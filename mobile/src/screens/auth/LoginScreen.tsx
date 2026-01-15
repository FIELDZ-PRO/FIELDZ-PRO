import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Logo } from '../../components/Logo';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme';
import { useAuth } from '../../hooks/useAuth';
import { login as loginApi } from '../../api/auth';

interface LoginScreenProps {
  onSwitchToRegister: () => void;
}

export default function LoginScreen({ onSwitchToRegister }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
      Alert.alert('Erreur', error.message || 'Échec de la connexion');
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
        <Text style={styles.title}>Let's go</Text>
        <Text style={styles.subtitle}>Connecte-toi pour trouver ton terrain</Text>
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

        <View style={styles.forgotPasswordContainer}>
          <TouchableOpacity onPress={() => console.log('Forgot password')} activeOpacity={0.7}>
            <Text style={styles.forgotPasswordText}>Mot de passe oublié?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.submitButtonContainer}>
          <Button fullWidth onPress={handleSubmit}>
            Se connecter
          </Button>
        </View>
      </View>

      {/* Switch to Register */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchText}>Pas encore de compte? </Text>
        <TouchableOpacity onPress={onSwitchToRegister} activeOpacity={0.7}>
          <Text style={styles.switchLink}>Inscris-toi</Text>
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
    paddingBottom: 32,
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
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    paddingTop: 4,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primaryDark,
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
