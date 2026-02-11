import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  ScrollView,
  ActivityIndicator,
  Switch,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import {
  getApiBaseUrl,
  setUseLanIp,
  isUsingLanIp,
  getCurrentLanIp,
  setLanIp,
  getEnvironmentProfile,
  getAllBaseUrls,
} from '../config/env';
import { get } from '../lib/apiClient';

/**
 * Diagnostics Screen for Factory Mobile App
 * Serial Step A: Production-ready API Networking Baseline
 * 
 * Features:
 * - Display current resolved API base URL
 * - Toggle "Use LAN IP" for physical device testing
 * - Editable LAN IP field
 * - Test endpoints: GET /, GET /db/health
 * - Display results with timestamp, status, latency, response snippet
 * - Copy diagnostics to clipboard
 */
export default function DiagnosticsScreen({ onBack }) {
  const [useLan, setUseLan] = useState(isUsingLanIp());
  const [lanIp, setLanIpInput] = useState(getCurrentLanIp());
  const [baseUrl, setBaseUrl] = useState(getApiBaseUrl());
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  // Update base URL when LAN IP toggle or IP changes
  useEffect(() => {
    setUseLanIp(useLan);
    setLanIp(lanIp);
    setBaseUrl(getApiBaseUrl());
  }, [useLan, lanIp]);

  /**
   * Add a result entry to the results list
   */
  const addResult = (result) => {
    setResults((prev) => [result, ...prev]);
  };

  /**
   * Test a single endpoint
   */
  const testEndpoint = async (endpoint, name) => {
    setLoading(true);

    const timestamp = new Date().toLocaleTimeString();
    const startTime = Date.now();

    try {
      const response = await get(endpoint);
      const totalLatency = Date.now() - startTime;

      const result = {
        timestamp,
        endpoint,
        name,
        ok: response.ok,
        status: response.status,
        latencyMs: response.latencyMs || totalLatency,
        data: response.data,
        errorCode: response.errorCode,
        errorMessage: response.errorMessage,
        rawError: response.rawError,
      };

      addResult(result);
    } catch (error) {
      const totalLatency = Date.now() - startTime;

      const result = {
        timestamp,
        endpoint,
        name,
        ok: false,
        status: null,
        latencyMs: totalLatency,
        data: null,
        errorCode: 'UNKNOWN',
        errorMessage: error.message,
        rawError: error.toString(),
      };

      addResult(result);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Test all endpoints sequentially
   */
  const testAllEndpoints = async () => {
    setLoading(true);
    setResults([]); // Clear previous results

    await testEndpoint('/', 'Root');
    await new Promise((resolve) => setTimeout(resolve, 500)); // Brief pause between requests
    await testEndpoint('/db/health', 'Health');

    setLoading(false);
  };

  /**
   * Clear all results
   */
  const clearResults = () => {
    setResults([]);
  };

  /**
   * Copy diagnostics to clipboard
   */
  const copyDiagnostics = async () => {
    const profile = getEnvironmentProfile();
    const allUrls = getAllBaseUrls();

    let diagnosticsText = `Factory Mobile Diagnostics\n`;
    diagnosticsText += `Generated: ${new Date().toLocaleString()}\n`;
    diagnosticsText += `\n--- Configuration ---\n`;
    diagnosticsText += `Environment Profile: ${profile}\n`;
    diagnosticsText += `Current Base URL: ${baseUrl}\n`;
    diagnosticsText += `Platform: ${Platform.OS}\n`;
    diagnosticsText += `Use LAN IP: ${useLan ? 'Yes' : 'No'}\n`;
    diagnosticsText += `LAN IP: ${lanIp}\n`;
    diagnosticsText += `\n--- Available Base URLs ---\n`;
    diagnosticsText += `Android Emulator: ${allUrls.dev_android_emulator}\n`;
    diagnosticsText += `iOS Simulator: ${allUrls.dev_ios_simulator}\n`;
    diagnosticsText += `Web: ${allUrls.dev_web}\n`;
    diagnosticsText += `LAN (Physical Device): ${allUrls.dev_lan}\n`;
    diagnosticsText += `Staging: ${allUrls.staging}\n`;
    diagnosticsText += `Production: ${allUrls.prod}\n`;

    diagnosticsText += `\n--- Test Results (${results.length}) ---\n`;
    results.forEach((result, index) => {
      diagnosticsText += `\n[${index + 1}] ${result.timestamp} - ${result.name} (${result.endpoint})\n`;
      diagnosticsText += `  Status: ${result.ok ? '✅ SUCCESS' : '❌ FAILED'}\n`;
      diagnosticsText += `  HTTP Status: ${result.status || 'N/A'}\n`;
      diagnosticsText += `  Latency: ${result.latencyMs}ms\n`;

      if (result.ok && result.data) {
        const dataSnippet =
          typeof result.data === 'string'
            ? result.data.substring(0, 200)
            : JSON.stringify(result.data, null, 2).substring(0, 200);
        diagnosticsText += `  Response: ${dataSnippet}${dataSnippet.length >= 200 ? '...' : ''}\n`;
      }

      if (!result.ok) {
        diagnosticsText += `  Error Code: ${result.errorCode}\n`;
        diagnosticsText += `  Error: ${result.errorMessage}\n`;
      }
    });

    await Clipboard.setStringAsync(diagnosticsText);
    Alert.alert('Copied!', 'Diagnostics copied to clipboard');
  };

  /**
   * Format a result entry for display
   */
  const formatResult = (result) => {
    let text = `[${result.timestamp}] ${result.name}\n`;
    text += `Endpoint: ${result.endpoint}\n`;
    text += `Status: ${result.ok ? '✅ SUCCESS' : '❌ FAILED'}\n`;
    text += `HTTP Status: ${result.status || 'N/A'}\n`;
    text += `Latency: ${result.latencyMs}ms\n`;

    if (result.ok && result.data) {
      const dataSnippet =
        typeof result.data === 'string'
          ? result.data.substring(0, 100)
          : JSON.stringify(result.data, null, 2).substring(0, 100);
      text += `Response: ${dataSnippet}${dataSnippet.length >= 100 ? '...' : ''}\n`;
    }

    if (!result.ok) {
      text += `Error Code: ${result.errorCode}\n`;
      text += `Error: ${result.errorMessage}\n`;
    }

    return text;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>API Diagnostics</Text>
        {onBack && (
          <Button title="← Back" onPress={onBack} />
        )}
      </View>

      <View style={styles.configSection}>
        <Text style={styles.sectionTitle}>Configuration</Text>
        <Text style={styles.baseUrlText}>Base URL: {baseUrl}</Text>
        <Text style={styles.platformText}>Platform: {Platform.OS}</Text>

        <View style={styles.lanToggleRow}>
          <Text style={styles.lanToggleLabel}>Use LAN IP (Physical Device):</Text>
          <Switch value={useLan} onValueChange={setUseLan} />
        </View>

        <View style={styles.lanIpRow}>
          <Text style={styles.lanIpLabel}>LAN IP:</Text>
          <TextInput
            style={styles.lanIpInput}
            value={lanIp}
            onChangeText={setLanIpInput}
            placeholder="192.168.x.x"
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        <Text style={styles.helpText}>
          💡 For physical devices: Enable "Use LAN IP" and set your PC's IP address (ipconfig)
        </Text>
      </View>

      <View style={styles.testSection}>
        <Text style={styles.sectionTitle}>Endpoint Tests</Text>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button title="Test GET /" onPress={() => testEndpoint('/', 'Root')} disabled={loading} />
          </View>
          <View style={styles.buttonWrapper}>
            <Button
              title="Test Health"
              onPress={() => testEndpoint('/db/health', 'Health')}
              disabled={loading}
            />
          </View>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.buttonWrapper}>
            <Button title="Test All" onPress={testAllEndpoints} disabled={loading} color="#007bff" />
          </View>
          <View style={styles.buttonWrapper}>
            <Button title="Clear" onPress={clearResults} disabled={loading} color="#6c757d" />
          </View>
        </View>
      </View>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Testing...</Text>
        </View>
      )}

      <View style={styles.resultsSection}>
        <View style={styles.resultsTitleRow}>
          <Text style={styles.sectionTitle}>Results ({results.length})</Text>
          {results.length > 0 && (
            <Button title="📋 Copy" onPress={copyDiagnostics} />
          )}
        </View>

        <ScrollView style={styles.resultsScroll}>
          {results.length === 0 && !loading && (
            <Text style={styles.noResultsText}>No tests run yet. Press a test button above.</Text>
          )}
          {results.map((result, index) => (
            <View
              key={index}
              style={[
                styles.resultItem,
                result.ok ? styles.resultSuccess : styles.resultError,
              ]}
            >
              <Text style={styles.resultText}>{formatResult(result)}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  configSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  baseUrlText: {
    fontSize: 13,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#007bff',
    marginBottom: 5,
  },
  platformText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
  },
  lanToggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  lanToggleLabel: {
    fontSize: 14,
    color: '#333',
  },
  lanIpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  lanIpLabel: {
    fontSize: 14,
    color: '#333',
    marginRight: 10,
    width: 60,
  },
  lanIpInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 14,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    backgroundColor: '#fff',
  },
  helpText: {
    fontSize: 12,
    color: '#6c757d',
    fontStyle: 'italic',
    marginTop: 8,
  },
  testSection: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  buttonWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: '#666',
  },
  resultsSection: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  resultsScroll: {
    flex: 1,
  },
  noResultsText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 20,
  },
  resultItem: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    borderWidth: 1,
  },
  resultSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
  },
  resultError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
  },
  resultText: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
  },
});
