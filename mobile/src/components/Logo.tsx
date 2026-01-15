import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'light' | 'dark';
}

export function Logo({ size = 'md', variant = 'dark' }: LogoProps) {
  const fontSize = {
    sm: 22,
    md: 32,
    lg: 48,
  };

  const textColor = variant === 'light' ? '#FFFFFF' : colors.text;

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { fontSize: fontSize[size], color: textColor }]}>
        FIELD
      </Text>
      <Text style={[styles.text, { fontSize: fontSize[size], color: colors.primaryDark }]}>
        Z
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  text: {
    fontWeight: '900',
    letterSpacing: -0.5,
  },
});
