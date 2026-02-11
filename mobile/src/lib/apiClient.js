import { getApiBaseUrl } from '../config/env';
import { getToken } from '../auth/tokenStore';

/**
 * API Client for Factory Mobile App
 * Serial Step A: Production-ready API Networking Baseline
 * Serial Step B: Added Authorization header support
 * 
 * Features:
 * - Configurable timeout (default: 10s)
 * - Retry logic for transient network errors
 * - Consistent error mapping
 * - Latency measurement
 * - Automatic Authorization header injection (Step B)
 */

const DEFAULT_TIMEOUT_MS = 10000; // 10 seconds
const MAX_RETRIES = 1; // Retry once for transient errors

/**
 * Error codes for consistent error handling
 */
export const ERROR_CODES = {
  TIMEOUT: 'TIMEOUT',
  NETWORK_ERROR: 'NETWORK_ERROR',
  CONNECTION_REFUSED: 'CONNECTION_REFUSED',
  HTTP_ERROR: 'HTTP_ERROR',
  PARSE_ERROR: 'PARSE_ERROR',
  UNKNOWN: 'UNKNOWN',
};

/**
 * Map native error messages to consistent error codes
 * @param {Error} error - The error object
 * @returns {string} - Error code from ERROR_CODES
 */
function mapErrorToCode(error) {
  const message = error.message || '';
  
  // Timeout errors
  if (message.includes('aborted') || message.includes('timeout')) {
    return ERROR_CODES.TIMEOUT;
  }
  
  // Connection refused
  if (
    message.includes('ECONNREFUSED') ||
    message.includes('actively refused') ||
    message.includes('Connection refused')
  ) {
    return ERROR_CODES.CONNECTION_REFUSED;
  }
  
  // Generic network errors
  if (
    message.includes('Network request failed') ||
    message.includes('ENOTFOUND') ||
    message.includes('ETIMEDOUT') ||
    message.includes('ECONNRESET')
  ) {
    return ERROR_CODES.NETWORK_ERROR;
  }
  
  return ERROR_CODES.UNKNOWN;
}

/**
 * Get human-readable error message
 * @param {string} errorCode - Error code from ERROR_CODES
 * @param {string} originalMessage - Original error message
 * @returns {string} - Human-readable error message
 */
function getErrorMessage(errorCode, originalMessage) {
  switch (errorCode) {
    case ERROR_CODES.TIMEOUT:
      return `Request timeout: The server took too long to respond (>${DEFAULT_TIMEOUT_MS}ms)`;
    case ERROR_CODES.CONNECTION_REFUSED:
      return `Connection refused: Unable to connect to the API server. Ensure the API is running and the URL is correct.`;
    case ERROR_CODES.NETWORK_ERROR:
      return `Network error: ${originalMessage}. Check your internet connection and API server.`;
    case ERROR_CODES.HTTP_ERROR:
      return `HTTP error: ${originalMessage}`;
    case ERROR_CODES.PARSE_ERROR:
      return `Parse error: Unable to parse server response.`;
    default:
      return `Unknown error: ${originalMessage}`;
  }
}

/**
 * Determine if an error is retryable
 * @param {string} errorCode - Error code from ERROR_CODES
 * @returns {boolean}
 */
function isRetryableError(errorCode) {
  return (
    errorCode === ERROR_CODES.TIMEOUT ||
    errorCode === ERROR_CODES.NETWORK_ERROR
  );
}

/**
 * Make a fetch request with timeout using AbortController
 * @param {string} url - The URL to fetch
 * @param {object} options - Fetch options
 * @param {number} timeoutMs - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
async function fetchWithTimeout(url, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

/**
 * Main API request function with retry logic
 * 
 * Serial Step B: Automatically injects Authorization header if token exists
 * 
 * @param {string} endpoint - API endpoint path (e.g., '/', '/db/health')
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {number} timeoutMs - Request timeout in milliseconds
 * @param {number} retries - Number of retries remaining
 * @returns {Promise<object>} - Result object with ok, status, latencyMs, data, error
 */
async function apiRequest(
  endpoint,
  options = {},
  timeoutMs = DEFAULT_TIMEOUT_MS,
  retries = MAX_RETRIES
) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${endpoint}`;
  const startTime = Date.now();
  
  // Get auth token and inject Authorization header if it exists (Step B)
  const token = await getToken();
  const headers = { ...(options.headers || {}) };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  // Merge headers back into options
  const requestOptions = {
    ...options,
    headers,
  };
  
  try {
    // Make request with timeout
    const response = await fetchWithTimeout(url, requestOptions, timeoutMs);
    const latencyMs = Date.now() - startTime;
    
    // Check if response is OK (status 200-299)
    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        latencyMs,
        data: null,
        errorCode: ERROR_CODES.HTTP_ERROR,
        errorMessage: getErrorMessage(
          ERROR_CODES.HTTP_ERROR,
          `Status ${response.status}: ${response.statusText}`
        ),
        rawError: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
    
    // Try to parse response as JSON
    let data;
    let dataText;
    try {
      dataText = await response.text();
      data = JSON.parse(dataText);
    } catch (parseError) {
      // If JSON parse fails, return the text
      data = dataText;
    }
    
    return {
      ok: true,
      status: response.status,
      latencyMs,
      data,
      dataText,
      errorCode: null,
      errorMessage: null,
      rawError: null,
    };
  } catch (error) {
    const latencyMs = Date.now() - startTime;
    const errorCode = mapErrorToCode(error);
    
    // Retry logic for transient errors
    if (retries > 0 && isRetryableError(errorCode)) {
      console.log(`Retrying request to ${endpoint} (${retries} retries left)`);
      // Wait a bit before retrying (100ms)
      await new Promise(resolve => setTimeout(resolve, 100));
      return apiRequest(endpoint, options, timeoutMs, retries - 1);
    }
    
    return {
      ok: false,
      status: null,
      latencyMs,
      data: null,
      dataText: null,
      errorCode,
      errorMessage: getErrorMessage(errorCode, error.message),
      rawError: error.message,
    };
  }
}

/**
 * Convenience method for GET requests
 * @param {string} endpoint - API endpoint path
 * @param {number} timeoutMs - Optional timeout override
 * @returns {Promise<object>}
 */
export async function get(endpoint, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return apiRequest(endpoint, { method: 'GET' }, timeoutMs);
}

/**
 * Convenience method for POST requests
 * @param {string} endpoint - API endpoint path
 * @param {object} body - Request body (will be JSON stringified)
 * @param {number} timeoutMs - Optional timeout override
 * @returns {Promise<object>}
 */
export async function post(endpoint, body, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return apiRequest(
    endpoint,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    },
    timeoutMs
  );
}

/**
 * Generic request method (exposed for custom use cases)
 * @param {string} endpoint - API endpoint path
 * @param {object} options - Fetch options
 * @param {number} timeoutMs - Optional timeout override
 * @returns {Promise<object>}
 */
export async function request(endpoint, options = {}, timeoutMs = DEFAULT_TIMEOUT_MS) {
  return apiRequest(endpoint, options, timeoutMs);
}

// Export default API client
export default {
  get,
  post,
  request,
  ERROR_CODES,
};
