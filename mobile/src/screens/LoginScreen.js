import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ActivityIndicator,
  Alert,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useAuth } from '../auth/AuthProvider';
import { DEV_AUTH } from '../auth/authTypes';

/**
 * Login Screen
 * Serial Step B: Local Auth + Identity Baseline
 * 
 * DEV MOCK AUTH MODE:
 * This screen validates email/password format locally and generates
 * a dev token. It does NOT call backend endpoints.
 * 
 * In production, this will be replaced with real API authentication.
 */
export default function LoginScreen() {
  const { login, isLoading, error, clearError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    clearError();
    
    const result = await login(email, password);
    
    if (!result.success) {
      Alert.alert('Login Failed', result.error || 'Please try again');
    }
    // If successful, AuthProvider will update state and UI will change
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {/* Dev Mode Warning */}
          <View style={styles.devWarning}>
            <Text style={styles.devWarningText}>⚠️ DEV AUTH ONLY</Text>
            <Text style={styles.devWarningSubtext}>
              Local mock authentication (no backend required)
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>Factory Mobile</Text>
          <Text style={styles.subtitle}>Sign in to continue</Text>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="your.email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder={`Min ${DEV_AUTH.MIN_PASSWORD_LENGTH} characters`}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
          </View>

          {/* Error Display */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>
                {error === 'invalid_email'
                  ? 'Please enter a valid email address'
                  : error === 'invalid_password'
                  ? `Password must be at least ${DEV_AUTH.MIN_PASSWORD_LENGTH} characters`
                  : 'An error occurred. Please try again.'}
              </Text>
            </View>
          )}

          {/* Login Button */}
          <View style={styles.buttonContainer}>
            {isLoading ? (
              <ActivityIndicator size="large" color="#007bff" />
            ) : (
              <Button
                title="Sign In"
                onPress={handleLogin}
                disabled={!email || !password}
              />
            )}
          </View>

          {/* Dev Mode Instructions */}
          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Dev Mode Instructions:</Text>
            <Text style={styles.instructionsText}>
              • Enter any email in valid format (a@b.c)
            </Text>
            <Text style={styles.instructionsText}>
              • Password must be at least {DEV_AUTH.MIN_PASSWORD_LENGTH} characters
            </Text>
            <Text style={styles.instructionsText}>
              • A local token will be generated and stored securely
            </Text>
            <Text style={styles.instructionsText}>
              • No backend authentication required
            </Text>
          </View>

          {/* Version Info */}
          <Text style={styles.versionText}>
            Auth Mode: {DEV_AUTH.MODE}
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  devWarning: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffc107',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  devWarningText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#856404',
    textAlign: 'center',
  },
  devWarningSubtext: {
    fontSize: 12,
    color: '#856404',
    textAlign: 'center',
    marginTop: 4,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  errorContainer: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  errorText: {
    color: '#721c24',
    fontSize: 14,
  },
  buttonContainer: {
    marginTop: 8,
    marginBottom: 24,
  },
  instructions: {
    backgroundColor: '#e7f3ff',
    borderColor: '#b3d7ff',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  instructionsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#004085',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 12,
    color: '#004085',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#999',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
});
