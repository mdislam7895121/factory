import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  Platform,
  Alert,
} from 'react-native';
import { manualRoutes } from '../routes/routeRegistry';
import { getMockMode, setMockMode } from '../lib/mockMode';

/**
 * Demo Hub Screen
 * Platform Kit Feature: Browse all generated features and toggle mock mode
 * 
 * This screen allows developers to:
 * - View all registered routes
 * - Navigate to any feature
 * - Toggle mock mode on/off
 * - See feature metadata
 */
export default function DemoHubScreen({ navigation, onNavigate }) {
  const [mockMode, setMockModeLocal] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMockMode();
  }, []);

  const loadMockMode = async () => {
    try {
      const mode = await getMockMode();
      setMockModeLocal(mode);
    } catch (err) {
      console.error('Failed to load mock mode:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleMockModeToggle = async (newValue) => {
    setMockModeLocal(newValue);
    await setMockMode(newValue);
  };

  const handleNavigateToRoute = (route) => {
    if (onNavigate) {
      onNavigate(route.name);
    } else if (navigation?.navigate) {
      navigation.navigate(route.screenId);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🔧 Demo Hub</Text>
        <Text style={styles.headerSubtitle}>
          Platform Kit v1.0 - Feature Preview & Mock Mode
        </Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Mock Mode Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mock Mode</Text>
          <View style={styles.mockModeCard}>
            <View style={styles.mockModeRow}>
              <View style={styles.mockModeText}>
                <Text style={styles.mockModeLabel}>
                  {mockMode ? '✅ Mock Mode ON' : '❌ Mock Mode OFF'}
                </Text>
                <Text style={styles.mockModeDesc}>
                  {mockMode
                    ? 'Returning mock responses from specs'
                    : 'Making real API calls'}
                </Text>
              </View>
              <Switch
                value={mockMode}
                onValueChange={handleMockModeToggle}
                trackColor={{ false: '#ccc', true: '#81c784' }}
                thumbColor={mockMode ? '#4caf50' : '#f1f1f1'}
              />
            </View>
          </View>
        </View>

        {/* Routes Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Routes ({manualRoutes.length})
          </Text>
          {manualRoutes.map((route) => (
            <TouchableOpacity
              key={route.name}
              style={styles.routeCard}
              onPress={() => handleNavigateToRoute(route)}
            >
              <View style={styles.routeInfo}>
                <Text style={styles.routeName}>{route.title}</Text>
                <Text style={styles.routePath}>{route.path}</Text>
                {route.requiresAuth && (
                  <View style={styles.authBadge}>
                    <Text style={styles.authBadgeText}>🔒 Auth</Text>
                  </View>
                )}
              </View>
              <Text style={styles.routeArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.infoCard}>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Factory Platform Kit</Text>
              {'\n'}Spec-driven mobile feature generation
              {'\n\n'}
              <Text style={styles.infoBold}>Version:</Text> 1.0.0
              {'\n'}
              <Text style={styles.infoBold}>Platform:</Text> {Platform.OS}
              {'\n'}
              <Text style={styles.infoBold}>Mock Mode:</Text>{' '}
              {mockMode ? 'Enabled' : 'Disabled'}
            </Text>
          </View>
        </View>

        {/* Developer Info */}
        <View style={styles.devInfo}>
          <Text style={styles.devTitle}>For Developers</Text>
          <Text style={styles.devText}>
            • New features are generated from JSON specs{'\n'}
            • Run: node tools/generate-mobile-feature.mjs --spec
            {'\n'}
            • Mock mode enables offline development{'\n'}
            • Routes are auto-registered in the app
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#666',
    fontStyle: 'italic',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    marginBottom: 10,
  },
  mockModeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: mockMode ? '#81c784' : '#e0e0e0',
  },
  mockModeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mockModeText: {
    flex: 1,
    marginRight: 12,
  },
  mockModeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  mockModeDesc: {
    fontSize: 12,
    color: '#666',
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  routeInfo: {
    flex: 1,
  },
  routeName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  routePath: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  authBadge: {
    backgroundColor: '#e3f2fd',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  authBadgeText: {
    fontSize: 11,
    color: '#1976d2',
    fontWeight: '600',
  },
  routeArrow: {
    fontSize: 18,
    color: '#999',
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  infoText: {
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: '#333',
  },
  devInfo: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#ffc107',
  },
  devTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
    marginBottom: 8,
  },
  devText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
});
