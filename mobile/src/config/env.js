import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Environment Configuration for Factory Mobile App
 * Serial Step A: Production-ready API Networking Baseline
 * 
 * Supports multiple deployment profiles with platform-aware routing.
 */

// Environment profiles
export const ENV_PROFILES = {
  DEV: 'dev',
  STAGING: 'staging',
  PROD: 'prod',
};

// Base URLs for each environment profile
const DEV_ANDROID_EMULATOR_BASE = 'http://10.0.2.2:4000';
const DEV_IOS_SIMULATOR_BASE = 'http://localhost:4000';
const DEV_WEB_BASE = 'http://localhost:4000';

// Configurable LAN IP for physical device testing
// Update this to your development machine's IP address (ipconfig on Windows)
const DEV_LAN_IP = '192.168.12.179';
const DEV_LAN_BASE = `http://${DEV_LAN_IP}:4000`;

// Staging and Production endpoints (placeholders)
const STAGING_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL_STAGING ||
  'https://api-staging.factory.example.com';
const PROD_BASE =
  process.env.EXPO_PUBLIC_API_BASE_URL ||
  'https://api.factory.example.com';

// Current active profile (default: DEV in development, PROD otherwise)
let currentProfile = __DEV__ ? ENV_PROFILES.DEV : ENV_PROFILES.PROD;

// Manual override for LAN IP mode (for physical devices)
let useLanIpOverride = false;

/**
 * Set the active environment profile
 * @param {string} profile - One of ENV_PROFILES (dev, staging, prod)
 */
export function setEnvironmentProfile(profile) {
  if (!Object.values(ENV_PROFILES).includes(profile)) {
    console.warn(`Invalid profile: ${profile}. Using DEV.`);
    currentProfile = ENV_PROFILES.DEV;
    return;
  }
  currentProfile = profile;
}

/**
 * Get the current environment profile
 * @returns {string} Current profile name
 */
export function getEnvironmentProfile() {
  return currentProfile;
}

/**
 * Enable or disable LAN IP override for physical device testing
 * @param {boolean} enabled - Whether to use LAN IP
 */
export function setUseLanIp(enabled) {
  useLanIpOverride = enabled;
}

/**
 * Check if LAN IP override is enabled
 * @returns {boolean}
 */
export function isUsingLanIp() {
  return useLanIpOverride;
}

/**
 * Get the configured LAN IP address
 * @returns {string}
 */
export function getLanIp() {
  return DEV_LAN_IP;
}

/**
 * Update the LAN IP address (runtime configuration)
 * Note: This is a simple in-memory update. For persistent config,
 * consider AsyncStorage or similar.
 * @param {string} newIp - New LAN IP address
 */
let runtimeLanIp = DEV_LAN_IP;
export function setLanIp(newIp) {
  runtimeLanIp = newIp;
}

export function getCurrentLanIp() {
  return runtimeLanIp;
}

/**
 * Detect if running on a physical device vs emulator/simulator
 * Note: This is a heuristic and may not be 100% reliable.
 * 
 * For Android:
 * - Emulator typically has specific device names or patterns
 * - Real devices have varied manufacturer names
 * 
 * For iOS:
 * - Simulator: Platform.isPad/isTV return false, but this is not definitive
 * 
 * Fallback: Allow manual toggle via useLanIpOverride
 * 
 * @returns {boolean} - true if likely a physical device
 */
function isLikelyPhysicalDevice() {
  // Manual override takes precedence
  if (useLanIpOverride) {
    return true;
  }
  
  // For web, never use LAN IP
  if (Platform.OS === 'web') {
    return false;
  }
  
  // Use Expo's device signal when available
  // Constants.isDevice is false for simulators/emulators
  return Boolean(Constants?.isDevice);
}

function assertValidPublicBaseUrl(url, label) {
  const normalized = (url || '').trim().replace(/\/+$/, '');

  if (!normalized) {
    throw new Error(`${label} is required and cannot be empty.`);
  }

  if (!/^https?:\/\//.test(normalized)) {
    throw new Error(`${label} must start with http:// or https://.`);
  }

  if (!__DEV__ && /example\.com|factory\.example\.com/.test(normalized)) {
    throw new Error(`${label} cannot use placeholder domains in production builds.`);
  }

  return normalized;
}

/**
 * Get the API base URL for the current environment and platform
 * 
 * Platform routing logic:
 * - Android Emulator: 10.0.2.2 (special alias for host machine)
 * - iOS Simulator: localhost
 * - Web: localhost
 * - Physical Device: LAN IP of development machine
 * 
 * @returns {string} - The API base URL
 */
export function getApiBaseUrl() {
  // Production and Staging environments use their respective URLs
  if (currentProfile === ENV_PROFILES.PROD) {
    return assertValidPublicBaseUrl(
      PROD_BASE,
      'PROD_BASE / EXPO_PUBLIC_API_BASE_URL',
    );
  }
  
  if (currentProfile === ENV_PROFILES.STAGING) {
    return assertValidPublicBaseUrl(
      STAGING_BASE,
      'STAGING_BASE / EXPO_PUBLIC_API_BASE_URL_STAGING',
    );
  }
  
  // DEV environment: platform-aware routing
  const isPhysicalDevice = isLikelyPhysicalDevice();
  
  if (isPhysicalDevice) {
    return `http://${runtimeLanIp}:4000`;
  }
  
  // Emulator/Simulator routing
  if (Platform.OS === 'android') {
    return DEV_ANDROID_EMULATOR_BASE;
  } else if (Platform.OS === 'ios') {
    return DEV_IOS_SIMULATOR_BASE;
  } else if (Platform.OS === 'web') {
    return DEV_WEB_BASE;
  }
  
  // Fallback: assume localhost
  return DEV_IOS_SIMULATOR_BASE;
}

/**
 * Get all available base URLs (for diagnostics)
 * @returns {object}
 */
export function getAllBaseUrls() {
  return {
    dev_android_emulator: DEV_ANDROID_EMULATOR_BASE,
    dev_ios_simulator: DEV_IOS_SIMULATOR_BASE,
    dev_web: DEV_WEB_BASE,
    dev_lan: `http://${runtimeLanIp}:4000`,
    staging: STAGING_BASE,
    prod: PROD_BASE,
  };
}

// Export default
export default {
  ENV_PROFILES,
  getApiBaseUrl,
  setEnvironmentProfile,
  getEnvironmentProfile,
  setUseLanIp,
  isUsingLanIp,
  getLanIp,
  setLanIp,
  getCurrentLanIp,
  getAllBaseUrls,
};
