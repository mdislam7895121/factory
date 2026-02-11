import { getApiBaseUrl } from '../../config/env';
import { getToken } from '../../auth/tokenStore';
import { getMockMode } from '../../lib/mockMode';
import inventoryMocks from '../mocks/inventory.mocks';

/**
 * Inventory Management API Client
 * Generated from spec: inventory/1.0.0
 * 
 * Endpoints:
 * - listItems: GET /items
 * - getItem: GET /items/:id
 * - createItem: POST /items
 * - updateItem: PUT /items/:id
 * - deleteItem: DELETE /items/:id
 */

const BASE_URL = getApiBaseUrl();
const API_BASE = '/inventory';

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
    const mockKey = Object.keys(inventoryMocks).find(key => 
      inventoryMocks[key]?.mockPath === path && 
      inventoryMocks[key]?.method === method
    );

    if (mockMode && mockKey) {
      console.log(`[MOCK] inventory.${mockKey}`);
      return inventoryMocks[mockKey]?.response || { ok: false, errorMessage: 'Mock not found' };
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
const inventoryApi = {

  listItems: async (body = null) => {
    return request('GET', '/items', body);
  },

  getItem: async (id, body = null) => {
    return request('GET', '/items/:id', id: id, body);
  },

  createItem: async (body = null) => {
    return request('POST', '/items', body);
  },

  updateItem: async (id, body = null) => {
    return request('PUT', '/items/:id', id: id, body);
  },

  deleteItem: async (id, body = null) => {
    return request('DELETE', '/items/:id', id: id, body);
  },
};

export default inventoryApi;
export { inventoryApi };
