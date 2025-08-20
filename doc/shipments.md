---

### 📦 Shipment Methods хүснэгт

```sql
INSERT INTO shipment_methods (id, name, code, description, is_active) VALUES
(1, 'Pickup at Store', 'pickup', 'Customer picks up from branch', TRUE),
(2, 'Home Delivery', 'delivery', 'Courier delivers to customer address', TRUE);
```

---

### 📍 Locations хүснэгт

```sql
INSERT INTO locations (id, name, type, address_id) VALUES
(1, 'Central Warehouse', 'warehouse', 101),
(2, 'Downtown Store', 'pickup_point', 102),
(3, 'Airport Store', 'pickup_point', 103);
```

---

### 🏠 Address хүснэгт

```sql
INSERT INTO addresses (id, street, city, country, postal_code) VALUES
(101, 'Warehouse District 10', 'Ulaanbaatar', 'MN', '10010'),
(102, 'Peace Avenue 45', 'Ulaanbaatar', 'MN', '10020'),
(103, 'Airport Road 1', 'Ulaanbaatar', 'MN', '10030'),
(201, 'Customer Street 1', 'Ulaanbaatar', 'MN', '10050');  -- delivery customer address
```

---

### 📦 Shipments хүснэгт

```sql
-- 1) Pickup point дээр очих shipment
INSERT INTO shipments (id, order_id, shipment_method_id, address_id, location_id, price, status)
VALUES
(1001, 5001, 1, NULL, 2, 0, 'ready_for_pickup'); 
-- shipment_method.code = 'pickup', location_id = 2 (Downtown Store)

INSERT INTO shipments (id, order_id, shipment_method_id, address_id, location_id, price, status)
VALUES
(1002, 5002, 1, NULL, 3, 0, 'ready_for_pickup'); 
-- shipment_method.code = 'pickup', location_id = 3 (Airport Store)

-- 2) Delivery shipment
INSERT INTO shipments (id, order_id, shipment_method_id, address_id, location_id, price, status)
VALUES
(1003, 5003, 2, 201, 1, 5000, 'pending'); 
-- shipment_method.code = 'delivery', address_id = customer, location_id = Central Warehouse
```

---

### 📝 Тайлбар

* `shipment_method.code = 'pickup'` → **address\_id = NULL**, `location_id` = pickup point
* `shipment_method.code = 'delivery'` → **address\_id ≠ NULL**, `location_id` = аливаа warehouse / fulfillment center
* `price = 0` → pickup, `price > 0` → delivery

---
```mermaid
erDiagram
PRODUCTS ||--o{ PRODUCT_VARIANTS : has
PRODUCT_VARIANTS ||--o{ INVENTORIES : stock_in
INVENTORIES }o--|| LOCATIONS : stored_at
LOCATIONS }o--|| ADDRESSES : has_address

    ORDERS ||--o{ ORDER_ITEMS : contains
    ORDER_ITEMS }o--|| PRODUCT_VARIANTS : refers_to

    ORDERS }o--|| SHIPMENT_METHODS : uses
    SHIPMENTS }o--|| ORDERS : belongs_to
    SHIPMENTS }o--|| SHIPMENT_METHODS : uses
    SHIPMENTS }o--|| LOCATIONS : from
    SHIPMENTS }o--|| ADDRESSES : to_address

    ORDER_ITEMS ||--o{ DIGITAL_FULFILLMENTS : digital_for
    ORDER_ITEMS ||--o{ SERVICE_FULFILLMENTS : service_for

    ADDRESSES {
        id PK
        street
        city
        country
        postal_code
    }

    LOCATIONS {
        id PK
        name
        type
        address_id FK
    }

    PRODUCTS {
        id PK
        title
        type
        description
    }

    PRODUCT_VARIANTS {
        id PK
        product_id FK
        sku
        attributes
        price
        weight
        length
        width
        height
    }

    INVENTORIES {
        id PK
        variant_id FK
        location_id FK
        quantity
        reserved
    }

    ORDERS {
        id PK
        customer_id
        shipment_method_id FK
        shipment_price
        status
        shipping_address_id FK
    }

    ORDER_ITEMS {
        id PK
        order_id FK
        product_variant_id FK
        quantity
        unit_price
        weight_snapshot
        length_snapshot
        width_snapshot
        height_snapshot
    }

    SHIPMENT_METHODS {
        id PK
        name
        code
        description
        is_active
    }

    SHIPMENTS {
        id PK
        order_id FK
        shipment_method_id FK
        address_id FK
        location_id FK
        price
        status
    }

    DIGITAL_FULFILLMENTS {
        id PK
        order_item_id FK
        download_url
        license_key
        expires_at
        fulfilled_at
    }

    SERVICE_FULFILLMENTS {
        id PK
        order_item_id FK
        service_date
        service_location
        assigned_to
        status
        notes
    }
```

 - Physical product → shipment
 - Digital product → digital_fulfillment
 - Service product → service_fulfillment
 - Inventory → locations

Pickup point vs warehouse бүгд location-аар ялгагдана.