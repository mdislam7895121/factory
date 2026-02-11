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
- ✅ **Diagnostics Screen** (Serial Step A): Production-ready API networking with timeout, retry, and latency measurement
- ✅ **Local Authentication** (Serial Step B): Dev mock authentication with encrypted token storage

## Diagnostics (Serial Step A)

The Diagnostics screen provides comprehensive API connectivity testing and troubleshooting tools.

### Accessing Diagnostics

1. Start the mobile app
2. Tap the **🔧 Diagnostics** button in the top-right corner

### Features

- **Current Configuration Display**: Shows resolved API base URL and platform
- **LAN IP Toggle**: Enable for physical device testing (automatic for emulator/simulator)
- **Editable LAN IP**: Update your development machine's IP address on-the-fly
- **Endpoint Testing**:
  - Test GET `/` (Root endpoint)
  - Test GET `/db/health` (Database health check)
  - Test All endpoints at once
- **Detailed Results**:
  - Timestamp of each test
  - HTTP status code
  - Latency in milliseconds
  - Response data snippet
  - Error codes and human-readable error messages
- **Copy to Clipboard**: Export complete diagnostics report for troubleshooting

### Running API + Mobile Together

**Terminal 1 - API Server**:
```bash
cd C:\Users\vitor\Dev\factory\api
npm run start:dev
```

Wait for: `API listening on http://0.0.0.0:4000`

**Terminal 2 - Mobile App**:
```bash
cd C:\Users\vitor\Dev\factory\mobile
npm start
```

Wait for: `Metro waiting on exp://...` (QR code displayed)

### Platform-Specific Networking

#### Android Emulator
- **Base URL**: `http://10.0.2.2:4000`
- **Why**: Android emulator uses `10.0.2.2` as special alias for host machine's `127.0.0.1`
- **Auto-configured**: No manual setup needed

#### iOS Simulator  
- **Base URL**: `http://localhost:4000`
- **Why**: iOS simulator shares network stack with host machine
- **Auto-configured**: No manual setup needed

#### Physical Device (Android/iOS)
- **Base URL**: `http://<YOUR_PC_LAN_IP>:4000`
- **Setup**:
  1. Find your PC's LAN IP:
     ```bash
     # Windows PowerShell
     ipconfig
     # Look for "IPv4 Address" (e.g., 192.168.1.100)
     ```
  2. In Diagnostics screen, enable **"Use LAN IP"** toggle
  3. Enter your PC's IP in the **LAN IP** field
  4. Ensure PC and device are on **same WiFi network**
  5. Ensure API server is listening on `0.0.0.0` (already configured in `api/src/main.ts`)

### Expected Diagnostics Outputs

#### Successful Test (Emulator/Simulator):
```
[10:30:45 AM] Root
Endpoint: /
Status: ✅ SUCCESS
HTTP Status: 200
Latency: 45ms
Response: "Hello World!"

[10:30:46 AM] Health
Endpoint: /db/health
Status: ✅ SUCCESS
HTTP Status: 200
Latency: 120ms
Response: {"ok":true,"insertedId":"...","count":25}
```

#### Failed Test (API not running):
```
[10:32:10 AM] Root
Endpoint: /
Status: ❌ FAILED
HTTP Status: N/A
Latency: 10012ms
Error Code: CONNECTION_REFUSED
Error: Connection refused: Unable to connect to the API server. 
       Ensure the API is running and the URL is correct.
```

### Networking Features (Serial Step A)

- **Timeout**: 10-second timeout per request (prevents indefinite hangs)
- **Retry Logic**: Automatic retry once for transient network errors (timeouts, connection drops)
- **Error Mapping**: Consistent error codes:
  - `TIMEOUT`: Request exceeded 10s limit
  - `CONNECTION_REFUSED`: API server not reachable (ECONNREFUSED)
  - `NETWORK_ERROR`: General network failure (DNS, connection reset, etc.)
  - `HTTP_ERROR`: Server returned non-2xx status code
  - `PARSE_ERROR`: Response body couldn't be parsed
- **Latency Measurement**: Millisecond-precision round-trip time tracking

### Environment Profiles

The app supports multiple environment profiles (configurable in `src/config/env.js`):

- **DEV** (default): Local development server
  - Android Emulator: `http://10.0.2.2:4000`
  - iOS Simulator: `http://localhost:4000`
  - Physical Device: `http://<LAN_IP>:4000`
- **STAGING**: Placeholder for staging environment (`https://api-staging.factory.example.com`)
- **PROD**: Placeholder for production environment (`https://api.factory.example.com`)

Currently, only DEV profile is active. To switch profiles, modify `src/config/env.js`.

## Authentication (Serial Step B)

The mobile app implements local authentication with encrypted token storage. This is a **dev mock authentication** system that does not connect to backend `/auth` endpoints (which don't exist yet).

### Authentication Flow

1. **App Launch**: App checks for existing auth token in SecureStore
2. **Login Required**: If no valid token, shows login screen
3. **Dev Mock Login**: User enters email/password, validated locally, generates UUID token
4. **Token Storage**: Token and user data stored in encrypted SecureStore
5. **Authenticated State**: All API requests include `Authorization: Bearer <token>` header
6. **Logout**: Clears token from SecureStore, returns to login screen

### Using Authentication

#### Login (Dev Mock Mode)

1. Start the mobile app
2. You'll see the **Login Screen** with a dev mode warning badge
3. Enter any valid email format (e.g., `test@factory.local`)
4. Enter any password with at least 6 characters (e.g., `password123`)
5. Tap **Login**
6. You'll be logged in and see the home screen with user email displayed

**Dev Mode Rules**:
- No backend `/auth` endpoints are called
- Email must be valid format (contains `@`)
- Password must be at least 6 characters
- Token is a local UUID (e.g., `mock-dev-token-a1b2c3d4...`)
- User ID is a local UUID

#### Viewing Profile

1. When logged in, tap the **👤 Profile** button in the top-right
2. View your user details:
   - User ID (UUID)
   - Email address
   - Auth token (truncated for security)
3. Tap **Back to Home** to return

#### Logout

1. From Profile screen, tap **Logout**
2. Confirm in the alert dialog
3. Token is cleared from SecureStore
4. Returns to Login screen

#### Accessing Diagnostics

When authenticated:
1. Tap the **🔧 Diagnostics** button in the top-right
2. All API requests will automatically include your auth token in the `Authorization` header

### Authentication Architecture

#### Components

- **`src/auth/authTypes.js`**: Constants and type definitions
  - Auth statuses: `LOGGED_OUT`, `LOGGING_IN`, `LOGGED_IN`, `ERROR`, `BOOTSTRAPPING`
  - Auth actions: `BOOTSTRAP_SUCCESS`, `LOGIN_REQUEST`, `LOGIN_SUCCESS`, `LOGIN_FAILURE`, `LOGOUT`
  - Error codes: `INVALID_EMAIL`, `INVALID_PASSWORD`, `STORAGE_ERROR`

- **`src/auth/tokenStore.js`**: SecureStore wrapper for token/user persistence
  - `getToken()`: Retrieve stored auth token
  - `setToken(token)`: Store auth token securely
  - `clearToken()`: Remove auth token
  - `getUser()`: Retrieve stored user object
  - `setUser(user)`: Store user object securely
  - `clearAll()`: Remove all auth data

- **`src/auth/AuthProvider.js`**: React Context provider with state machine
  - `useAuth()` hook: Access auth state and actions
  - `login(email, password)`: Dev mock login (local validation only)
  - `logout()`: Clear auth state and storage
  - `bootstrap()`: Load token/user from storage on app launch

- **`src/screens/LoginScreen.js`**: Login UI with dev mode warnings
- **`src/screens/ProfileScreen.js`**: User profile and logout

#### API Client Integration

The `src/lib/apiClient.js` automatically injects the auth token into all API requests:

```javascript
const token = await getToken();
const headers = {
  'Content-Type': 'application/json',
};

if (token) {
  headers['Authorization'] = `Bearer ${token}`;
}
```

This means all API calls (Diagnostics, future features) automatically include authentication.

### Security Notes

⚠️ **Dev Mock Authentication Warning**:
- This is NOT production-ready authentication
- No backend validation occurs (no `/auth/login` endpoint exists)
- Tokens are generated locally (UUID, not JWT)
- Any email + 6-char password will work
- Do NOT use real credentials

🔒 **Storage Security**:
- Tokens stored via Expo SecureStore (encrypted at device level)
- iOS: Keychain Services
- Android: EncryptedSharedPreferences (API 23+) or KeyStore
- Never stored in plain AsyncStorage
- Keys: `factory_auth_token`, `factory_auth_user`

🚧 **Future Production Auth**:
- Replace `generateDevToken()` with API call to `/auth/login`
- Validate JWT tokens with backend
- Implement refresh token flow
- Add session expiration
- Add biometric authentication (fingerprint/face)

### Testing Authentication

#### Manual Test Checklist

1. **Fresh Install**:
   - Kill and restart app
   - Verify Login screen shows
   - Verify dev mode warning is visible

2. **Login Flow**:
   - Try invalid email (no `@`): Should show error
   - Try short password (<6 chars): Should show error
   - Try valid credentials: Should log in successfully
   - Verify home screen shows user email

3. **Token Persistence**:
   - Log in successfully
   - Kill app completely
   - Restart app
   - Verify you're still logged in (no login screen)

4. **Navigation**:
   - Tap Profile button: Should show profile
   - Tap Diagnostics button: Should show diagnostics
   - Navigate back to home: Should work

5. **Logout**:
   - From Profile screen, tap Logout
   - Confirm in alert
   - Verify returns to Login screen
   - Restart app
   - Verify Login screen shows (token cleared)

6. **API Integration**:
   - Log in
   - Go to Diagnostics
   - Run API tests
   - Verify requests succeed (auth header doesn't break non-auth endpoints)

### Expected Auth Outputs

#### Successful Login:
```
// No visual console output
// User sees Home screen with:
// "Logged in as: test@factory.local"
```

#### Token in API Requests:
```
// In apiClient.js (not visible to user)
Authorization: Bearer mock-dev-token-a1b2c3d4-e5f6-7890-abcd-ef1234567890
```

#### SecureStore Data:
```
// Key: factory_auth_token
mock-dev-token-a1b2c3d4-e5f6-7890-abcd-ef1234567890

// Key: factory_auth_user
{
  "id": "mock-user-id-a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "email": "test@factory.local",
  "name": "Dev User"
}
```

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
