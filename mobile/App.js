import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ScrollView, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { API_BASE_URL } from './config';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

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
      <Text style={styles.title}>Factory Mobile App</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
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
