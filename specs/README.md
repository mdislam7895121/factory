# Factory Mobile Spec Format

**Version:** 1.0  
**Purpose:** Versioned specification format for generating mobile features using a spec-driven generator.

## Philosophy

The Factory Platform Kit uses **spec-driven scaffolding** to accelerate mobile feature development. Instead of manually creating screens, API clients, routes, and mocks, teams define a feature specification in JSON and run the generator to produce:

- React Native screens  (list, details, form, dashboard)
- API clients with mock support
- Type definitions
- Route registry entries
- Mock response data
- Tests and diagnostics

This approach ensures:
- **Consistency**: All generated features follow the same patterns
- **Speed**: New features ship in minutes, not days
- **Maintainability**: Specs are single source of truth
- **Testability**: Mock mode + web preview enable testing without backends

## Versioning Strategy

- **v1.0**: Initial release, mobile-only, basic screens (list, details, form, dashboard)
- **v1.1**: (Future) Auth variants, advanced form validation, pagination
- **v2.0**: (Future) Web support, API route generation, database schema

## Spec Structure

A feature specification is a JSON document that defines:

### Top Level

```json
{
  "featureId": "products",
  "title": "Products Management",
  "version": "1.0.0",
  "description": "Manage product catalog with list, details, and form creation",
  "routes": [...],
  "screens": [...],
  "apiClients": [...],
  "mocks": [...],
  "flags": [...],
  "demo": {...}
}
```

### Routes

Array of app routes (navigation targets):

```json
"routes": [
  {
    "name": "productsList",
    "path": "products/list",
    "screenId": "ProductsList",
    "requiresAuth": true,
    "title": "Products"
  }
]
```

**Fields:**
- `name`: Route identifier (must be unique)
- `path`: Navigation path
- `screenId`: Which screen to render
- `requiresAuth`: Boolean (currently N/A in mobile, but for future API gating)
- `title`: Display name

### Screens

Array of UI screens to generate:

```json
"screens": [
  {
    "id": "ProductsList",
    "type": "list",
    "title": "Products",
    "components": [
      {
        "name": "ProductItem",
        "description": "List item for a product"
      }
    ]
  }
]
```

**Fields:**
- `id`: Screen identifier (must match screenId in routes)
- `type`: One of: `list`, `details`, `form`, `dashboard`
- `title`: Screen title shown in header
- `components`: Sub-components to scaffold

### API Clients

Array of API client definitions:

```json
"apiClients": [
  {
    "id": "productsApi",
    "base": "/products",
    "description": "Products CRUD operations",  
    "endpoints": [
      {
        "name": "listProducts",
        "method": "GET",
        "path": "/",
        "auth": "bearer",
        "description": "Fetch all products"
      },
      {
        "name": "getProduct",
        "method": "GET",
        "path": "/:id",
        "auth": "bearer",
        "description": "Fetch a single product"
      }
    ]
  }
]
```

**Fields:**
- `id`: API client identifier
- `base`: Base path (appended to API_BASE_URL)
- `endpoints`: Array of endpoint definitions
  - `name`: Function name in generated client
  - `method`: HTTP method (GET, POST, PUT, DELETE)
  - `path`: Endpoint path (relative to base)
  - `auth`: `none` or `bearer` (if bearer, auth header injected if token available)
  - `description`: Docstring

### Mocks

Mock response data for each endpoint:

```json
"mocks": [
  {
    "endpoint": "productsApi.listProducts",
    "response": {
      "ok": true,
      "data": [
        {
          "id": "prod-1",
          "name": "Widget A",
          "price": 29.99
        }
      ]
    },
    "status": 200
  }
]
```

**Fields:**
- `endpoint`: Format: `{clientId}.{endpointName}`
- `response`: Mock response object
- `status`: HTTP status code

### Flags

Feature flags (can be toggled at runtime):

```json
"flags": [
  {
    "id": "mockMode",
    "label": "Use Mock Data",
    "default": true,
    "description": "Return mock responses instead of calling API"
  }
]
```

### Demo

Demo configuration:

```json
"demo": {
  "enabled": true,
  "seedData": {
    "products": [...]
  }
}
```

## Example Spec

See `examples/feature-sample.json` for a complete example.

## Generator Usage

Generate a feature from a spec:

```bash
cd factory
node tools/generate-mobile-feature.mjs --spec specs/examples/feature-sample.json
```

Dry-run (no file writes):

```bash
node tools/generate-mobile-feature.mjs --spec specs/examples/feature-sample.json --dry-run
```

## Output Structure

Generated features live under `mobile/src/features/{featureId}/`:

```
mobile/src/features/products/
├── screens/
│   ├── ProductsList.js      (generated list screen)
│   ├── ProductsDetails.js   (generated details screen)
│   └── ProductsForm.js      (generated form screen)
├── api/
│   └── products.api.js      (generated API client with mocks)
├── model/
│   └── products.types.js    (generated type definitions)
├── mocks/
│   └── products.mocks.js    (generated mock responses)
└── index.js                  (barrel export)
```

Route registry entries are automatically added to `mobile/src/routes/routeRegistry.js` between marker comments.

## Design Patterns

### Auth Integration

If auth is available (Serial Step B), generated API clients automatically:
- Check for stored token
- Inject `Authorization: Bearer {token}` header if token exists
- Handle 401 responses gracefully

### Mock Mode

When mock mode is enabled (flag or UI toggle):
- API calls are intercepted
- Mock responses are returned
- UI behaves identically to real mode

This allows testing and demoing without a backend.

### Network Resolution

All generated features use the existing `getApiBaseUrl()` from `src/config/env.js`, ensuring:
- Android emulator → `10.0.2.2:4000`
- iOS simulator → `localhost:4000`
- Web → `localhost:4000`
- Physical device → LAN IP with toggle support

## Extending the Spec

To add new screen types, API patterns, or features:

1. Update `specs/mobile.feature.v1.schema.json`
2. Update generator templates in `tools/templates/mobile/`
3. Update this README
4. Bump version to v1.1

## Next Steps (Future)

- [ ] Backend API spec format (OpenAPI-compatible)
- [ ] Web component generation
- [ ] Database schema generation
- [ ] E2E test generation
- [ ] Analytics tracking scaffolding
- [ ] Component library integration
