// FIELDZ Design System - Light Mode (Exact Figma Colors)
export const colors = {
  // Primary - From Figma CSS Variables
  primary: '#1ED760', // Energy green (--energy-green)
  primaryDark: '#05602B', // Primary green (--primary-green)
  primaryHover: '#1ED760',

  // Backgrounds - Light Mode
  background: '#F9FAFB', // Light gray (--light-gray from Figma)
  card: '#FFFFFF', // White for cards
  white: '#FFFFFF',

  // Text - From Figma
  text: '#0E0E0E', // Text primary (--text-primary from Figma)
  textSecondary: '#6B7280', // Text secondary (--text-secondary from Figma)
  textMuted: '#9CA3AF',

  // Borders - From Figma
  border: '#E5E7EB', // Border gray (--border-gray from Figma)
  cardBorder: '#E5E7EB',

  // Status
  success: '#1ED760',
  successBg: 'rgba(30, 215, 96, 0.1)',
  warning: '#F59E0B',
  warningBg: 'rgba(245, 158, 11, 0.1)',
  error: '#EF4444',
  errorBg: 'rgba(239, 68, 68, 0.1)',

  // Special
  black: '#0E0E0E', // Use text primary as black
  overlay: 'rgba(0, 0, 0, 0.5)',
  inputBg: 'rgba(0, 0, 0, 0.05)',
  cardHover: 'rgba(0, 0, 0, 0.05)',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const borderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
  full: 9999,
};

export const typography = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 26,
};

export const shadows = {
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 3,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
};

export default {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
};
