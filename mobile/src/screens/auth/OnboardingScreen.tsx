import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Logo } from '../../components/Logo';
import { colors } from '../../theme';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: 'search' as const,
    title: 'Trouve ton club',
    description: 'Recherche parmi les meilleurs clubs sportifs près de toi',
  },
  {
    icon: 'time' as const,
    title: 'Vois les créneaux',
    description: 'Tous les horaires disponibles en temps réel',
  },
  {
    icon: 'flash' as const,
    title: 'Réserve en un clic',
    description: 'Confirme ta réservation instantanément',
  },
];

export default function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const slide = slides[currentSlide];

  return (
    <View style={styles.container}>
      {/* Decorative Elements */}
      <View style={styles.decorativeElements}>
        {/* Top Right Circle */}
        <View style={styles.topRightCircle} />

        {/* Bottom Left Circle */}
        <View style={styles.bottomLeftCircle} />

        {/* Floating Dots - Top Left */}
        <View style={styles.dotsTopLeft}>
          <View style={styles.dot} />
          <View style={[styles.dot, { marginBottom: 12 }]} />
          <View style={styles.dot} />
        </View>

        {/* Floating Dots - Bottom Right */}
        <View style={styles.dotsBottomRight}>
          <View style={[styles.dot, { marginBottom: 12 }]} />
          <View style={styles.dot} />
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Logo size="md" variant="light" />
        </View>

        {/* Skip Button */}
        <View style={styles.skipContainer}>
          <TouchableOpacity
            onPress={handleSkip}
            style={styles.skipButton}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>Passer</Text>
          </TouchableOpacity>
        </View>

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconBox}>
            <Ionicons name={slide.icon} size={64} color={colors.white} />
          </View>
        </View>

        {/* Title & Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{slide.title}</Text>
          <Text style={styles.description}>{slide.description}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationContainer}>
          {slides.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: index === currentSlide ? 32 : 8,
                  backgroundColor:
                    index === currentSlide
                      ? colors.white
                      : 'rgba(255, 255, 255, 0.3)',
                },
              ]}
            />
          ))}
        </View>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          style={styles.nextButton}
          activeOpacity={0.9}
        >
          <Text style={styles.nextButtonText}>
            {currentSlide === slides.length - 1 ? 'Commencer' : 'Suivant'}
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.primaryDark} />
        </TouchableOpacity>

        {/* Bottom Spacer */}
        <View style={{ height: 32 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primaryDark,
    position: 'relative',
    overflow: 'hidden',
  },
  decorativeElements: {
    ...StyleSheet.absoluteFillObject,
    pointerEvents: 'none',
  },
  topRightCircle: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 256,
    height: 256,
    borderRadius: 128,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bottomLeftCircle: {
    position: 'absolute',
    bottom: 60,
    left: -60,
    width: 192,
    height: 192,
    borderRadius: 96,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  dotsTopLeft: {
    position: 'absolute',
    top: '30%',
    left: '10%',
  },
  dotsBottomRight: {
    position: 'absolute',
    bottom: '30%',
    right: '15%',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
    paddingTop: 16,
  },
  skipContainer: {
    alignItems: 'flex-end',
    marginBottom: 32,
  },
  skipButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  skipText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.white,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  iconBox: {
    width: 128,
    height: 128,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -0.72,
    color: colors.white,
    lineHeight: 40,
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    fontSize: 17,
    lineHeight: 27,
    color: colors.white,
    opacity: 0.9,
    fontWeight: '500',
    maxWidth: 280,
    textAlign: 'center',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
  },
  nextButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primaryDark,
  },
});
