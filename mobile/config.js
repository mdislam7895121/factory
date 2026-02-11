import { Platform } from 'react-native';

/**
 * API Configuration for Local Development
 * 
 * Android Emulator: Use 10.0.2.2 to reach host machine
 * iOS Simulator: Use localhost
 * Physical Device: Use LAN IP of your development machine
 * 
 * To use with physical device:
 * 1. Find your PC's LAN IP (ipconfig on Windows, look for IPv4)
 * 2. Set DEVICE_LAN_IP below to your PC's IP (e.g., "192.168.1.100")
 * 3. Ensure your phone and PC are on the same network
 * 4. Ensure API is listening on 0.0.0.0 or your LAN IP (not just 127.0.0.1)
 */

// Configure this for physical device testing
const DEVICE_LAN_IP = '192.168.12.179'; // Replace with your PC's LAN IP

const getApiBaseUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'android') {
      // Android emulator uses 10.0.2.2 to reach host machine
      return 'http://10.0.2.2:4000';
    } else if (Platform.OS === 'ios') {
      // iOS simulator can use localhost
      return 'http://localhost:4000';
    } else if (Platform.OS === 'web') {
      // Web can use localhost
      return 'http://localhost:4000';
    }
    // Physical device - use LAN IP
    return `http://${DEVICE_LAN_IP}:4000`;
  }
  
  // Production mode - would use actual production API
  return 'https://api.production.example.com';
};

export const API_BASE_URL = getApiBaseUrl();
