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
 * Home Screen (Protected)
 * Serial Step B: Local Auth + Identity Baseline
 * 
 * This is the main authenticated screen showing:
 * - Logged-in user email
 * - Resolved API base URL
 * - Diagnostics button
 * - Logout button
 */
export default function HomeScreen({ onNavigate }) {
  const { user, logout, isLoading } = useAuth();
  const apiBaseUrl = getApiBaseUrl();

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

  const handleNavigateToDemoHub = () => {
    if (onNavigate) {
      onNavigate('demoHub');
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
          <Text style={styles.title}>Welcome</Text>
          <Text style={styles.subtitle}>You are authenticated</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>User Information</Text>
          
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
        </View>

        {/* API Configuration Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>API Configuration</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Base URL:</Text>
            <Text style={styles.infoValue}>{apiBaseUrl}</Text>
          </View>

          <Text style={styles.cardDescription}>
            This shows the resolved API endpoint based on your device platform and configuration.
          </Text>
        </View>

        {/* Action Cards */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Actions</Text>
          
          <View style={styles.buttonGroup}>
            <Button 
              title="🎮 Demo Hub" 
              onPress={handleNavigateToDemoHub}
              color="#9333ea"
            />
          </View>

          <View style={styles.buttonSpacer} />
          
          <View style={styles.buttonGroup}>
            <Button 
              title="🔧 Open Diagnostics" 
              onPress={handleNavigateToDiagnostics}
              color="#007bff"
            />
          </View>

          <View style={styles.buttonSpacer} />

          <View style={styles.buttonGroup}>
            <Button 
              title="🚪 Logout" 
              onPress={handleLogout}
              disabled={isLoading}
              color="#dc3545"
            />
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <Text style={styles.infoSectionTitle}>About This App</Text>
          <Text style={styles.infoSectionText}>
            Factory Mobile - Serial Step B
            {'\n\n'}
            This app demonstrates local authentication with token persistence and network connectivity to the Factory API.
            {'\n\n'}
            The Diagnostics screen allows you to test the API endpoints and verify connectivity on your device's network.
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#dee2e6',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginVertical: 12,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
    fontStyle: 'italic',
  },
  infoRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#333',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  buttonGroup: {
    marginVertical: 6,
  },
  buttonSpacer: {
    height: 10,
  },
  infoSection: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
    backgroundColor: '#e7f3ff',
    borderLeftWidth: 4,
    borderLeftColor: '#007bff',
  },
  infoSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004085',
    marginBottom: 8,
  },
  infoSectionText: {
    fontSize: 13,
    color: '#004085',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc3545',
    textAlign: 'center',
  },
});
