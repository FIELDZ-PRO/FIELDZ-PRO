import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export function SplashScreen({ onFinish }: SplashScreenProps) {
  const spinValue = new Animated.Value(0);

  useEffect(() => {
    // Spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Navigate after 2 seconds
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <LinearGradient
      colors={[colors.primary, colors.primaryHover]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Logo - Scale 150% comme Figma */}
      <View style={styles.logoContainer}>
        <View style={styles.logoBox}>
          <Text style={styles.logoLetter}>F</Text>
        </View>
        <Text style={styles.logoText}>FIELDZ</Text>
      </View>

      {/* Loading */}
      <View style={styles.loadingContainer}>
        <Animated.View style={{ transform: [{ rotate: spin }] }}>
          <Ionicons name="reload" size={20} color={colors.white} />
        </Animated.View>
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>

      {/* Tagline */}
      <Text style={styles.tagline}>Cliki Tiri Marki</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    transform: [{ scale: 1.5 }],
  },
  logoBox: {
    width: 60,
    height: 60,
    backgroundColor: colors.white,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoLetter: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.primary,
  },
  logoText: {
    fontSize: 36,
    fontWeight: '800',
    color: colors.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 48,
  },
  loadingText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
  },
  tagline: {
    position: 'absolute',
    bottom: 32,
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
});
