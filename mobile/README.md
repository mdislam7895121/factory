# Factory Mobile App

React Native mobile application using Expo for the Factory project.

## Setup

```bash
cd mobile
npm install
```

## Running the App

```bash
npm start
```

This will start the Expo development server. You can then:
- Scan the QR code with Expo Go app (Android/iOS)
- Press `a` to open in Android emulator
- Press `i` to open in iOS simulator
- Press `w` to open in web browser

## API Configuration

The app connects to the local Factory API running on port 4000.

### Device-Specific Configuration

The app automatically detects the platform and uses the appropriate API URL:

- **Android Emulator**: `http://10.0.2.2:4000` (special alias for host machine)
- **iOS Simulator**: `http://localhost:4000`
- **Physical Device**: Uses LAN IP configured in `config.js`

### Testing on Physical Device

1. Find your PC's LAN IP address:
   ```bash
   # Windows
   ipconfig
   # Look for "IPv4 Address" under your active network adapter
   ```

2. Edit `config.js` and set `DEVICE_LAN_IP` to your PC's IP:
   ```javascript
   const DEVICE_LAN_IP = '192.168.1.100'; // Your PC's IP
   ```

3. Ensure your phone and PC are on the same WiFi network

4. Make sure the API is running and accessible:
   ```bash
   # From another terminal
   cd C:\Users\vitor\Dev\factory\api
   npm run start:dev
   ```

## Features

- ✅ API Health Check: Test connection to `/` and `/db/health` endpoints
- ✅ Multi-endpoint testing
- ✅ Error handling and display
- ✅ Platform-specific API URL configuration

## Troubleshooting

### "Network request failed" on physical device

- Verify PC and phone are on same WiFi network
- Check firewall isn't blocking port 4000
- Verify LAN IP is correct in `config.js`
- Test API from PC browser: `http://localhost:4000`
- Test API from phone browser: `http://<YOUR_PC_IP>:4000`

### Android emulator can't connect

- Ensure using `10.0.2.2` (not `localhost`) - automatically configured
- Ensure API is running on port 4000

### iOS simulator can't connect

- Ensure API is running on port 4000
- Try restarting the simulator
