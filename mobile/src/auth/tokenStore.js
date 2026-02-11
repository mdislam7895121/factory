import * as SecureStore from 'expo-secure-store';

/**
 * Token Storage using Expo SecureStore
 * Serial Step B: Local Auth + Identity Baseline
 * 
 * Secure storage for authentication tokens.
 * Uses expo-secure-store which provides encryption on device.
 * 
 * IMPORTANT: This is NOT AsyncStorage - tokens are encrypted!
 */

const TOKEN_KEY = 'factory_auth_token';
const USER_KEY = 'factory_auth_user';

/**
 * Get the stored authentication token
 * @returns {Promise<string|null>} The auth token or null if not found
 */
export async function getToken() {
  try {
    const token = await SecureStore.getItemAsync(TOKEN_KEY);
    return token;
  } catch (error) {
    console.error('Error getting token from SecureStore:', error);
    return null;
  }
}

/**
 * Store an authentication token securely
 * @param {string} token - The auth token to store
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function setToken(token) {
  try {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
    return true;
  } catch (error) {
    console.error('Error setting token in SecureStore:', error);
    return false;
  }
}

/**
 * Clear the stored authentication token
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function clearToken() {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing token from SecureStore:', error);
    return false;
  }
}

/**
 * Get the stored user data
 * @returns {Promise<object|null>} The user object or null if not found
 */
export async function getUser() {
  try {
    const userJson = await SecureStore.getItemAsync(USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  } catch (error) {
    console.error('Error getting user from SecureStore:', error);
    return null;
  }
}

/**
 * Store user data securely
 * @param {object} user - The user object to store (id, email, etc.)
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function setUser(user) {
  try {
    await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
    return true;
  } catch (error) {
    console.error('Error setting user in SecureStore:', error);
    return false;
  }
}

/**
 * Clear the stored user data
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function clearUser() {
  try {
    await SecureStore.deleteItemAsync(USER_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing user from SecureStore:', error);
    return false;
  }
}

/**
 * Clear all auth data (token and user)
 * @returns {Promise<boolean>} True if successful, false otherwise
 */
export async function clearAll() {
  try {
    await clearToken();
    await clearUser();
    return true;
  } catch (error) {
    console.error('Error clearing all auth data:', error);
    return false;
  }
}

export default {
  getToken,
  setToken,
  clearToken,
  getUser,
  setUser,
  clearUser,
  clearAll,
};
