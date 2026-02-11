import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { getApiBaseUrl } from '../config/env';

/**
 * Profile Screen (Protected)
 * Serial Step B: Local Auth + Identity Baseline
 * 
 * This screen displays user information and provides logout functionality.
 * Only accessible when authenticated.
 */
export default function ProfileScreen({ onNavigate }) {
  const { user, token, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            const result = await logout();
            if (!result.success) {
              Alert.alert('Logout Error', 'Failed to clear session data');
            }
            // AuthProvider will update state and UI will change
          },
        },
      ]
    );
  };

  const handleNavigateToDiagnostics = () => {
    if (onNavigate) {
      onNavigate('diagnostics');
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No user data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
          <Text style={styles.subtitle}>Your account information</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>User ID:</Text>
            <Text style={styles.infoValue}>{user.id}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          {user.name && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Name:</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
          )}

          {user.createdAt && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Created:</Text>
              <Text style={styles.infoValue}>
                {new Date(user.createdAt).toLocaleString()}
              </Text>
            </View>
          )}
        </View>

        {/* Token Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Authentication Token</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Token (truncated):</Text>
            <Text style={styles.tokenValue}>
              {token ? `${token.substring(0, 20)}...` : 'No token'}
            </Text>
          </View>

          <View style={styles.devNote}>
            <Text style={styles.devNoteText}>
              🔒 Token stored securely in expo-secure-store
            </Text>
            <Text style={styles.devNoteText}>
              ⚠️ Dev mock token - not from backend
            </Text>
          </View>
        </View>

        {/* API Configuration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>API Configuration</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Base URL:</Text>
            <Text style={styles.infoValue}>{getApiBaseUrl()}</Text>
          </View>

          <Text style={styles.configNote}>
            This shows the resolved API endpoint based on your device platform and network configuration.
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Actions</Text>
          
          <View style={styles.buttonRow}>
            <Button
              title="📋 Diagnostics"
              onPress={handleNavigateToDiagnostics}
              color="#6c757d"
            />
          </View>

          <View style={styles.buttonRow}>
            <Button
              title="🚪 Logout"
              onPress={handleLogout}
              color="#dc3545"
              disabled={isLoading}
            />
          </View>
        </View>

        {/* Security Info */}
        <View style={styles.securityInfo}>
          <Text style={styles.securityTitle}>Security Information</Text>
          <Text style={styles.securityText}>
            • Your token is encrypted on this device
          </Text>
          <Text style={styles.securityText}>
            • Logout will clear all stored credentials
          </Text>
          <Text style={styles.securityText}>
            • Dev mode: No backend validation yet
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoRow: {
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  tokenValue: {
    fontSize: 12,
    color: '#007bff',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  devNote: {
    marginTop: 8,
    padding: 10,
    backgroundColor: '#fff3cd',
    borderRadius: 4,
  },
  devNoteText: {
    fontSize: 12,
    color: '#856404',
    marginBottom: 4,
  },
  configNote: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
    fontStyle: 'italic',
  },
  actionsCard: {
    backgroundColor: '#fff',
    margin: 15,
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    marginBottom: 10,
  },
  securityInfo: {
    margin: 15,
    padding: 15,
    backgroundColor: '#e7f3ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#b3d7ff',
  },
  securityTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004085',
    marginBottom: 8,
  },
  securityText: {
    fontSize: 12,
    color: '#004085',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
    marginTop: 50,
  },
});
