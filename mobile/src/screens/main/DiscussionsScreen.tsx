import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors, borderRadius } from '../../theme';

export default function DiscussionsScreen() {
  const mockConversations = [
    {
      id: 1,
      avatar: '⚽',
      name: 'Match Football Hydra',
      lastMessage: 'On se retrouve à 18h devant le terrain',
      time: '10:30',
      unread: 2,
    },
    {
      id: 2,
      avatar: '🎾',
      name: 'Padel Squad',
      lastMessage: 'GG les gars! Prochaine fois?',
      time: 'Hier',
      unread: 0,
    },
    {
      id: 3,
      avatar: 'AB',
      name: 'Ahmed Benali',
      lastMessage: 'Tu joues ce weekend?',
      time: '15 Déc',
      unread: 1,
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Discussions</Text>
        <Text style={styles.subtitle}>Reste connecté avec ta team</Text>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInput}>
          <Ionicons name="search-outline" size={20} color={colors.textMuted} />
          <TextInput
            placeholder="Rechercher une conversation..."
            placeholderTextColor={colors.textMuted}
            style={styles.searchText}
          />
        </View>
      </View>

      {/* Conversations */}
      <ScrollView style={styles.conversationsList} contentContainerStyle={styles.conversationsContent}>
        {mockConversations.map((conv) => (
          <TouchableOpacity key={conv.id} style={styles.conversationCard}>
            <View style={styles.avatar}>
              {conv.avatar.length === 1 || conv.avatar.match(/[^\w\s]/) ? (
                <Text style={styles.avatarEmoji}>{conv.avatar}</Text>
              ) : (
                <LinearGradient
                  colors={[colors.primary, '#0A7B3D']}
                  style={styles.avatarGradient}
                >
                  <Text style={styles.avatarText}>{conv.avatar}</Text>
                </LinearGradient>
              )}
            </View>
            <View style={styles.conversationContent}>
              <View style={styles.conversationHeader}>
                <Text style={styles.conversationName}>{conv.name}</Text>
                <Text style={styles.conversationTime}>{conv.time}</Text>
              </View>
              <View style={styles.conversationMessage}>
                <Text style={styles.lastMessage} numberOfLines={1}>
                  {conv.lastMessage}
                </Text>
                {conv.unread > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadText}>{conv.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
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
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  searchContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  searchInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: borderRadius.xl,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  conversationsList: {
    flex: 1,
  },
  conversationsContent: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  conversationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
    overflow: 'hidden',
  },
  avatarEmoji: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 56,
    backgroundColor: colors.card,
  },
  avatarGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.black,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  conversationTime: {
    fontSize: 12,
    color: colors.textMuted,
  },
  conversationMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
  },
  unreadBadge: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.black,
  },
});
