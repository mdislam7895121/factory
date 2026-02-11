import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useState } from 'react';
import { getApiBaseUrl } from './src/config/env';
import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { AUTH_STATUS } from './src/auth/authTypes';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';
import HomeScreen from './src/screens/HomeScreen';

/**
 * Main App Component with Auth
 * Serial Step B: Added authentication with AuthProvider
 * Serial Step B: Uses getApiBaseUrl() from env.js for proper configuration
 */
function AppContent() {
  const { isAuthenticated, status } = useAuth();
  const [currentScreen, setCurrentScreen] = useState('home');

  // Show loading during bootstrap
  if (status === AUTH_STATUS.BOOTSTRAPPING) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  // Navigate between screens based on currentScreen state
  if (currentScreen === 'diagnostics') {
    return <DiagnosticsScreen onBack={() => setCurrentScreen('home')} />;
  }

  if (currentScreen === 'profile') {
    return <ProfileScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
  }

  // Home screen (authenticated)
  return <HomeScreen onNavigate={(screen) => setCurrentScreen(screen)} />;
}

/**
 * Root App Component
 * Wraps AppContent with AuthProvider
 */
export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  headerButtons: {
    flexDirection: 'row',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  userInfo: {
    fontSize: 12,
    color: '#28a745',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
  },
  buttonContainer: {
    marginBottom: 20,
  },
  buttonSpacer: {
    height: 10,
  },
  resultContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 10,
    borderRadius: 5,
  },
  resultText: {
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12,
  },
});
