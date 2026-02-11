import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { AUTH_STATUS, AUTH_ACTIONS, AUTH_ERRORS, DEV_AUTH } from './authTypes';
import { getToken, setToken, clearToken, getUser, setUser, clearAll } from './tokenStore';

/**
 * Auth Context Provider
 * Serial Step B: Local Auth + Identity Baseline
 * 
 * Manages authentication state and provides login/logout functionality.
 * 
 * DEV MOCK AUTH MODE:
 * - Does NOT call backend /auth endpoints (they don't exist yet)
 * - Validates email/password format locally
 * - Generates a local dev token (UUID)
 * - Stores token in SecureStore
 * - Sets user object in memory
 * 
 * This will be replaced with real backend auth in production.
 */

// Initial auth state
const initialState = {
  status: AUTH_STATUS.BOOTSTRAPPING,
  user: null,
  token: null,
  error: null,
};

// Auth reducer
function authReducer(state, action) {
  switch (action.type) {
    case AUTH_ACTIONS.BOOTSTRAP_START:
      return {
        ...state,
        status: AUTH_STATUS.BOOTSTRAPPING,
        error: null,
      };
    
    case AUTH_ACTIONS.BOOTSTRAP_SUCCESS:
      return {
        ...state,
        status: action.payload.token ? AUTH_STATUS.LOGGED_IN : AUTH_STATUS.LOGGED_OUT,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    
    case AUTH_ACTIONS.BOOTSTRAP_FAILURE:
      return {
        ...state,
        status: AUTH_STATUS.LOGGED_OUT,
        token: null,
        user: null,
        error: action.payload.error,
      };
    
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        status: AUTH_STATUS.LOGGING_IN,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        status: AUTH_STATUS.LOGGED_IN,
        token: action.payload.token,
        user: action.payload.user,
        error: null,
      };
    
    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        status: AUTH_STATUS.ERROR,
        error: action.payload.error,
      };
    
    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        status: AUTH_STATUS.LOGGED_OUT,
        token: null,
        user: null,
        error: null,
      };
    
    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
        status: state.status === AUTH_STATUS.ERROR ? AUTH_STATUS.LOGGED_OUT : state.status,
      };
    
    default:
      return state;
  }
}

// Create context
const AuthContext = createContext(undefined);

/**
 * Validate email format (basic check)
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password (basic check)
 */
function isValidPassword(password) {
  return password && password.length >= DEV_AUTH.MIN_PASSWORD_LENGTH;
}

/**
 * Generate a dev mock token (UUID)
 */
function generateDevToken() {
  // Simple UUID v4 generator
  return DEV_AUTH.TOKEN_PREFIX + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

/**
 * Generate a dev mock user object
 */
function generateDevUser(email) {
  return {
    id: 'dev_user_' + Math.random().toString(36).substring(7),
    email: email,
    name: email.split('@')[0], // Use part before @ as name
    createdAt: new Date().toISOString(),
  };
}

/**
 * Auth Provider Component
 */
export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /**
   * Bootstrap: Load auth state from SecureStore on app start
   */
  const bootstrap = useCallback(async () => {
    dispatch({ type: AUTH_ACTIONS.BOOTSTRAP_START });

    try {
      const storedToken = await getToken();
      const storedUser = await getUser();

      dispatch({
        type: AUTH_ACTIONS.BOOTSTRAP_SUCCESS,
        payload: {
          token: storedToken,
          user: storedUser,
        },
      });
    } catch (error) {
      console.error('Bootstrap error:', error);
      dispatch({
        type: AUTH_ACTIONS.BOOTSTRAP_FAILURE,
        payload: { error: AUTH_ERRORS.STORAGE_ERROR },
      });
    }
  }, []);

  /**
   * Dev Mock Login
   * Validates email/password format and generates a local token
   */
  const login = useCallback(async (email, password) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    // Validate email format
    if (!isValidEmail(email)) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: AUTH_ERRORS.INVALID_EMAIL },
      });
      return { success: false, error: 'Invalid email format' };
    }

    // Validate password
    if (!isValidPassword(password)) {
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: AUTH_ERRORS.INVALID_PASSWORD },
      });
      return { 
        success: false, 
        error: `Password must be at least ${DEV_AUTH.MIN_PASSWORD_LENGTH} characters` 
      };
    }

    try {
      // DEV MOCK: Generate local token and user
      const token = generateDevToken();
      const user = generateDevUser(email);

      // Store in SecureStore
      await setToken(token);
      await setUser(user);

      // Update state
      dispatch({
        type: AUTH_ACTIONS.LOGIN_SUCCESS,
        payload: { token, user },
      });

      return { success: true, user };
    } catch (error) {
      console.error('Login error:', error);
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: { error: AUTH_ERRORS.STORAGE_ERROR },
      });
      return { success: false, error: 'Storage error during login' };
    }
  }, []);

  /**
   * Logout
   * Clears token and user from SecureStore and resets state
   */
  const logout = useCallback(async () => {
    try {
      await clearAll();
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      // Still dispatch logout even if storage clear fails
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      return { success: false, error: 'Storage error during logout' };
    }
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  }, []);

  /**
   * Bootstrap on mount
   */
  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  // Computed values
  const isAuthenticated = state.status === AUTH_STATUS.LOGGED_IN && !!state.token;
  const isLoading = state.status === AUTH_STATUS.BOOTSTRAPPING || state.status === AUTH_STATUS.LOGGING_IN;

  const value = {
    // State
    status: state.status,
    user: state.user,
    token: state.token,
    error: state.error,
    isAuthenticated,
    isLoading,
    
    // Actions
    login,
    logout,
    bootstrap,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
