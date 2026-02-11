import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Mock Mode Management
 * Lightweight flag to toggle between real and mock API responses
 * Persisted in AsyncStorage for demo/testing
 */

const MOCK_MODE_KEY = 'factory_mock_mode_enabled';

let mockModeCache = null;

/**
 * Initialize mock mode (load from storage)
 */
export async function initMockMode() {
  try {
    const stored = await AsyncStorage.getItem(MOCK_MODE_KEY);
    mockModeCache = stored === 'true';
    console.log(`[MockMode] Initialized: ${mockModeCache ? 'ON' : 'OFF'}`);
    return mockModeCache;
  } catch (err) {
    console.error('[MockMode] Failed to initialize:', err);
    mockModeCache = true; // Default to mock
    return mockModeCache;
  }
}

/**
 * Get current mock mode state
 */
export async function getMockMode() {
  if (mockModeCache === null) {
    return initMockMode();
  }
  return mockModeCache;
}

/**
 * Set mock mode state
 */
export async function setMockMode(enabled) {
  try {
    await AsyncStorage.setItem(MOCK_MODE_KEY, enabled ? 'true' : 'false');
    mockModeCache = enabled;
    console.log(`[MockMode] Changed: ${enabled ? 'ON' : 'OFF'}`);
    return enabled;
  } catch (err) {
    console.error('[MockMode] Failed to set:', err);
    return mockModeCache;
  }
}

/**
 * Toggle mock mode
 */
export async function toggleMockMode() {
  const current = await getMockMode();
  return setMockMode(!current);
}

export default {
  initMockMode,
  getMockMode,
  setMockMode,
  toggleMockMode,
};
