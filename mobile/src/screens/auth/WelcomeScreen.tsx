import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Logo } from '../../components/Logo';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

export default function WelcomeScreen({ onSignUp, onLogin }: WelcomeScreenProps) {
  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Logo size="lg" variant="dark" />
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Main Message */}
      <View style={styles.messageContainer}>
        <Text style={styles.title}>
          Bienvenue sur{'\n'}FIELDZ
        </Text>
        <Text style={styles.subtitle}>
          Ton terrain, ton créneau,{'\n'}en quelques clics
        </Text>
      </View>

      {/* CTAs */}
      <View style={styles.ctaContainer}>
        <Button fullWidth onPress={onSignUp}>
          Créer un compte
        </Button>

        <TouchableOpacity
          onPress={onLogin}
          style={styles.loginButton}
          activeOpacity={0.7}
        >
          <Text style={styles.loginButtonText}>Se connecter</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>ou continuer avec</Text>
        <View style={styles.dividerLine} />
      </View>

      {/* Social Login */}
      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => console.log('Google login')}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: 'https://www.google.com/favicon.ico' }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => console.log('Facebook login')}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: 'https://www.facebook.com/favicon.ico' }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.socialButton}
          onPress={() => console.log('Apple login')}
          activeOpacity={0.7}
        >
          <Image
            source={{ uri: 'https://www.apple.com/favicon.ico' }}
            style={styles.socialIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 48,
    paddingTop: 16,
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.72,
    color: colors.text,
    lineHeight: 40,
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 26,
    color: colors.textSecondary,
    fontWeight: '500',
    maxWidth: 280,
    textAlign: 'center',
  },
  ctaContainer: {
    gap: 16,
    marginBottom: 24,
  },
  loginButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.primaryDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  socialIcon: {
    width: 24,
    height: 24,
  },
});
