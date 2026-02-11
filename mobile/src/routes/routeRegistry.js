/**
 * Route Registry for Factory Mobile App
 * 
 * Central registry of all application routes.
 * Generated route entries are added between markers below.
 * 
 * Manual routes (from Serial Steps A/B) are defined above.
 */

// Manual routes (Serial Step A/B)
export const manualRoutes = [
  {
    name: 'home',
    path: 'home',
    title: 'Home',
    screenId: 'Home',
    requiresAuth: true,
  },
  {
    name: 'profile',
    path: 'profile',
    title: 'Profile',
    screenId: 'Profile',
    requiresAuth: true,
  },
  {
    name: 'diagnostics',
    path: 'diagnostics',
    title: 'Diagnostics',
    screenId: 'Diagnostics',
    requiresAuth: true,
  },
  {
    name: 'demoHub',
    path: 'demo-hub',
    title: 'Demo Hub',
    screenId: 'DemoHub',
    requiresAuth: true,
  },
  // START_MARKER: GENERATED_ROUTES
  {
    name: 'inventoryList',
    path: 'inventory/list',
    title: 'Inventory',
    screenId: 'InventoryList',
    requiresAuth: true,
  },
  {
    name: 'inventoryDetails',
    path: 'inventory/details/:id',
    title: 'Item Details',
    screenId: 'InventoryDetails',
    requiresAuth: true,
  },
  {
    name: 'inventoryCreate',
    path: 'inventory/create',
    title: 'Add Item',
    screenId: 'InventoryForm',
    requiresAuth: true,
  },
  // END_MARKER: GENERATED_ROUTES
];

/**
 * Get all routes (manual + generated)
 */
export function getAllRoutes() {
  return manualRoutes;
}

/**
 * Get a route by name
 */
export function getRouteByName(name) {
  const all = getAllRoutes();
  return all.find((r) => r.name === name);
}

/**
 * Get routes requiring auth
 */
export function getProtectedRoutes() {
  const all = getAllRoutes();
  return all.filter((r) => r.requiresAuth);
}

export default {
  manualRoutes,
  getAllRoutes,
  getRouteByName,
  getProtectedRoutes,
};
