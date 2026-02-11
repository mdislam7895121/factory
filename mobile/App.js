import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useState } from 'react';
import { API_BASE_URL } from './config';
import { AuthProvider, useAuth } from './src/auth/AuthProvider';
import { AUTH_STATUS } from './src/auth/authTypes';
import LoginScreen from './src/screens/LoginScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import DiagnosticsScreen from './src/screens/DiagnosticsScreen';

/**
 * Main App Component with Auth
 * Serial Step B: Added authentication with AuthProvider
 */
function AppContent() {
  const { isAuthenticated, status, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [currentScreen, setCurrentScreen] = useState('home'); // home, profile, diagnostics

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

  const testEndpoint = async (path, name) => {
    setLoading(true);
    setResult(`Testing ${name}...\n`);
    
    try {
      const url = `${API_BASE_URL}${path}`;
      setResult(prev => prev + `\nFetching: ${url}\n`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      setResult(prev => prev + `\n✅ ${name} SUCCESS\n` + 
        `Status: ${response.status}\n` +
        `Response: ${JSON.stringify(data, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `\n❌ ${name} FAILED\n` + 
        `Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testAll = async () => {
    setLoading(true);
    setResult('Testing all endpoints...\n');
    
    try {
      // Test root endpoint
      const rootUrl = `${API_BASE_URL}/`;
      setResult(prev => prev + `\nFetching: ${rootUrl}\n`);
      const rootResponse = await fetch(rootUrl);
      const rootData = await rootResponse.json();
      setResult(prev => prev + `✅ Root endpoint SUCCESS\n` +
        `Status: ${rootResponse.status}\n` +
        `Response: ${JSON.stringify(rootData, null, 2)}\n\n`);
      
      // Test health endpoint
      const healthUrl = `${API_BASE_URL}/db/health`;
      setResult(prev => prev + `Fetching: ${healthUrl}\n`);
      const healthResponse = await fetch(healthUrl);
      const healthData = await healthResponse.json();
      setResult(prev => prev + `✅ Health endpoint SUCCESS\n` +
        `Status: ${healthResponse.status}\n` +
        `Response: ${JSON.stringify(healthData, null, 2)}\n`);
    } catch (error) {
      setResult(prev => prev + `\n❌ FAILED\nError: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with navigation */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Factory Mobile</Text>
        <View style={styles.headerButtons}>
          <Button 
            title="👤" 
            onPress={() => setCurrentScreen('profile')} 
            color={currentScreen === 'profile' ? '#007bff' : '#6c757d'}
          />
          <View style={{ width: 5 }} />
          <Button 
            title="🔧" 
            onPress={() => setCurrentScreen('diagnostics')} 
            color={currentScreen === 'diagnostics' ? '#007bff' : '#6c757d'}
          />
        </View>
      </View>
      
      {/* User info */}
      <Text style={styles.userInfo}>
        Logged in as: {user?.email || 'Unknown'}
      </Text>
      
      <Text style={styles.subtitle}>API: {API_BASE_URL}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Test Root (/)" 
          onPress={() => testEndpoint('/', 'Root')}
          disabled={loading}
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Test Health (/db/health)" 
          onPress={() => testEndpoint('/db/health', 'Health')}
          disabled={loading}
        />
        <View style={styles.buttonSpacer} />
        <Button 
          title="Test All Endpoints" 
          onPress={testAll}
          disabled={loading}
        />
      </View>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      
      <ScrollView style={styles.resultContainer}>
        <Text style={styles.resultText}>{result}</Text>
      </ScrollView>
      
      <StatusBar style="auto" />
    </View>
  );
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
