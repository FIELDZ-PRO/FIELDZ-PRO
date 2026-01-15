import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Logo } from '../../components/Logo';
import { colors } from '../../theme';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const bounceAnim = new Animated.Value(0);
  const pulse1 = new Animated.Value(1);
  const pulse2 = new Animated.Value(1);
  const pulse3 = new Animated.Value(1);

  useEffect(() => {
    // Logo bounce animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: -20,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse animations for circles
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse1, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulse1, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse2, {
          toValue: 1.1,
          duration: 1000,
          delay: 200,
          useNativeDriver: true,
        }),
        Animated.timing(pulse2, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse3, {
          toValue: 1.1,
          duration: 1000,
          delay: 400,
          useNativeDriver: true,
        }),
        Animated.timing(pulse3, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <View style={styles.container}>
      {/* Decorative circles */}
      <Animated.View
        style={[
          styles.circle1,
          { transform: [{ scale: pulse1 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circle2,
          { transform: [{ scale: pulse2 }] },
        ]}
      />
      <Animated.View
        style={[
          styles.circle3,
          { transform: [{ scale: pulse3 }] },
        ]}
      />

      {/* Logo with bounce */}
      <Animated.View
        style={[
          styles.logoContainer,
          { transform: [{ translateY: bounceAnim }] },
        ]}
      >
        <Logo size="lg" variant="dark" />
      </Animated.View>

      {/* Tagline */}
      <View style={styles.taglineContainer}>
        <Text style={styles.tagline}>Cliki Tiri Marki</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  circle1: {
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: 128,
    height: 128,
    borderRadius: 64,
    backgroundColor: colors.primaryDark,
    opacity: 0.1,
  },
  circle2: {
    position: 'absolute',
    bottom: '25%',
    right: '25%',
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    opacity: 0.1,
  },
  circle3: {
    position: 'absolute',
    top: '50%',
    right: '33%',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.primaryDark,
    opacity: 0.1,
  },
  logoContainer: {
    zIndex: 10,
  },
  taglineContainer: {
    marginTop: 32,
    zIndex: 10,
  },
  tagline: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
    letterSpacing: 0.8,
  },
});
