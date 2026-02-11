/**
 * Mobile Screen Registry
 * Central registry for resolving screenId -> React component
 * Supports both manual and dynamically generated screens
 */

import { lazy } from 'react';

// Manual screens (Serial Steps A/B)
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';
import DiagnosticsScreen from './DiagnosticsScreen';
import DemoHubScreen from './DemoHubScreen';

// Screen registry mapping screenId -> component
const screenRegistry = {
  // Manual routes (Serial Steps A/B)
  Home: HomeScreen,
  Profile: ProfileScreen,
  Diagnostics: DiagnosticsScreen,
  DemoHub: DemoHubScreen,

  // Generated screens will be registered here dynamically
  // Format: screenId: component
  // Example from inventory feature:
  // InventoryList: require('../features/inventory-management/screens/InventoryList').default,
  // InventoryDetails: require('../features/inventory-management/screens/InventoryDetails').default,
  // InventoryForm: require('../features/inventory-management/screens/InventoryForm').default,
};

/**
 * Register a new screen in the registry
 * Called by feature loaders
 * @param {string} screenId - PascalCase screen identifier
 * @param {React.Component} component - React component
 */
export function registerScreen(screenId, component) {
  if (screenRegistry[screenId]) {
    console.warn(`[WARN] Screen '${screenId}' already registered, overwriting...`);
  }
  screenRegistry[screenId] = component;
}

/**
 * Get a screen component by screenId
 * @param {string} screenId - PascalCase screen identifier
 * @returns {React.Component|null} Component or null if not found
 */
export function getScreen(screenId) {
  const screen = screenRegistry[screenId];
  if (!screen) {
    console.warn(`[WARN] Screen '${screenId}' not found in registry`);
    return null;
  }
  return screen;
}

/**
 * Register multiple screens at once
 * Useful for feature loaders
 * @param {Object} screens - Object with screenId: component mappings
 */
export function registerScreens(screens) {
  Object.entries(screens).forEach(([screenId, component]) => {
    registerScreen(screenId, component);
  });
}

/**
 * Get all registered screens
 * @returns {Object} Registry object
 */
export function getAllScreens() {
  return { ...screenRegistry };
}

/**
 * Check if a screen is registered
 * @param {string} screenId - Screen identifier to check
 * @returns {boolean}
 */
export function hasScreen(screenId) {
  return screenId in screenRegistry;
}

export default screenRegistry;
