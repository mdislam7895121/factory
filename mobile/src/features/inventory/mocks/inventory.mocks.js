[
  {
    "endpoint": "inventoryApi.listItems",
    "status": 200,
    "response": {
      "ok": true,
      "data": [
        {
          "id": "item-001",
          "name": "Widget A",
          "sku": "WGT-001",
          "quantity": 42,
          "location": "Shelf 1A",
          "category": "Widgets",
          "lastUpdated": "2026-02-11T15:30:00Z"
        },
        {
          "id": "item-002",
          "name": "Gadget B",
          "sku": "GDG-002",
          "quantity": 15,
          "location": "Bin 2",
          "category": "Gadgets",
          "lastUpdated": "2026-02-10T10:15:00Z"
        }
      ]
    }
  },
  {
    "endpoint": "inventoryApi.getItem",
    "status": 200,
    "response": {
      "ok": true,
      "data": {
        "id": "item-001",
        "name": "Widget A",
        "sku": "WGT-001",
        "quantity": 42,
        "location": "Shelf 1A",
        "category": "Widgets",
        "lastUpdated": "2026-02-11T15:30:00Z",
        "description": "High-quality industrial widget"
      }
    }
  },
  {
    "endpoint": "inventoryApi.createItem",
    "status": 201,
    "response": {
      "ok": true,
      "data": {
        "id": "item-new-123",
        "name": "New Item",
        "sku": "NEW-123",
        "quantity": 0,
        "location": "Staging",
        "category": "Uncategorized",
        "lastUpdated": "2026-02-11T15:45:00Z"
      }
    }
  }
]