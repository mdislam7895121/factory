/**
 * Auth Types and Constants
 * Serial Step B: Local Auth + Identity Baseline
 * 
 * Authentication state machine states and action types.
 */

// Auth Status States
export const AUTH_STATUS = {
  LOGGED_OUT: 'logged_out',
  LOGGING_IN: 'logging_in',
  LOGGED_IN: 'logged_in',
  ERROR: 'error',
  BOOTSTRAPPING: 'bootstrapping', // Loading initial state from storage
};

// Auth Action Types
export const AUTH_ACTIONS = {
  BOOTSTRAP_START: 'bootstrap_start',
  BOOTSTRAP_SUCCESS: 'bootstrap_success',
  BOOTSTRAP_FAILURE: 'bootstrap_failure',
  LOGIN_START: 'login_start',
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILURE: 'login_failure',
  LOGOUT: 'logout',
  CLEAR_ERROR: 'clear_error',
};

// Error Types
export const AUTH_ERRORS = {
  INVALID_EMAIL: 'invalid_email',
  INVALID_PASSWORD: 'invalid_password',
  STORAGE_ERROR: 'storage_error',
  UNKNOWN: 'unknown',
};

// Dev Mock Auth Constants
export const DEV_AUTH = {
  // In dev mode, we generate a local token instead of calling backend
  MODE: 'DEV_MOCK',
  TOKEN_PREFIX: 'dev_token_',
  MIN_PASSWORD_LENGTH: 6,
};
