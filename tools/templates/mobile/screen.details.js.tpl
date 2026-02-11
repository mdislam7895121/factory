import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  Button,
} from 'react-native';
import { {{camelCaseFeature}}Api } from '../api/{{featureId}}.api';

/**
 * {{screenName}} - Details Screen
 * Generated from spec: {{featureId}}/{{version}}
 * 
 * Displays detailed information for a single {{singular}}.
 */
export default function {{screenName}}({ route }) {
  const { id } = route?.params || {};
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      loadItem();
    }
  }, [id]);

  const loadItem = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await {{camelCaseFeature}}Api.get(id);
      if (result.ok) {
        setItem(result.data);
      } else {
        setError(result.errorMessage || 'Failed to load item');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  if (error || !item) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>
          {error || 'Item not found'}
        </Text>
        <Button title="Go Back" onPress={() => {}} color="#007bff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{item.name || item.title}</Text>
        
        {item.description && (
          <Text style={styles.description}>{item.description}</Text>
        )}
        
        {item.details && (
          <View style={styles.detailsContainer}>
            {Object.entries(item.details).map(([key, value]) => (
              <View key={key} style={styles.detailRow}>
                <Text style={styles.detailLabel}>{key}:</Text>
                <Text style={styles.detailValue}>{String(value)}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  detailsContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
    textAlign: 'right',
  },
  errorText: {
    fontSize: 14,
    color: '#dc3545',
    marginBottom: 16,
  },
});
