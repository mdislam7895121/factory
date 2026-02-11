import { getApiBaseUrl } from '../../config/env';
import { getToken } from '../../auth/tokenStore';
import { getMockMode } from '../../lib/mockMode';
import {{camelCaseFeature}}Mocks from '../mocks/{{featureId}}.mocks';

/**
 * {{title}} API Client
 * Generated from spec: {{featureId}}/{{version}}
 * 
 * Endpoints:
{{endpoints}}
 */

const BASE_URL = getApiBaseUrl();
const API_BASE = '{{apiBase}}';

/**
 * Helper to inject authorization header if token exists
 */
async function getAuthHeader() {
  const token = await getToken();
  return token ? { 'Authorization': `Bearer ${token}` } : {};
}

/**
 * Helper to make API requests with mock support
 */
async function request(method, path, body = null) {
  const mockMode = await getMockMode();
  const url = `${BASE_URL}${API_BASE}${path}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...await getAuthHeader(),
  };

  try {
    // Check for matching mock
    const mockKey = Object.keys({{camelCaseFeature}}Mocks).find(key => 
      {{camelCaseFeature}}Mocks[key]?.mockPath === path && 
      {{camelCaseFeature}}Mocks[key]?.method === method
    );

    if (mockMode && mockKey) {
      console.log(`[MOCK] {{camelCaseFeature}}.${mockKey}`);
      return {{camelCaseFeature}}Mocks[mockKey]?.response || { ok: false, errorMessage: 'Mock not found' };
    }

    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        errorMessage: `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      errorMessage: error.message,
    };
  }
}

/**
 * API Client Methods
 */
const {{camelCaseFeature}}Api = {
{{clientMethods}}
};

export default {{camelCaseFeature}}Api;
export { {{camelCaseFeature}}Api };
