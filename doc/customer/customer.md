---

## 🏗 ER загвар

```mermaid
erDiagram
    Customer ||--o{ CustomerGroupCustomer : belongs_to
    CustomerGroup ||--o{ CustomerGroupCustomer : has_many

    Customer ||--o{ CustomerSalesChannel : has_many
    SalesChannel ||--o{ CustomerSalesChannel : has_many

    Customer {
      uuid id PK
      text email
      text first_name
      text last_name
    }

    CustomerGroup {
      uuid id PK
      text name
      text description
    }

    CustomerGroupCustomer {
      uuid id PK
      uuid customer_id FK
      uuid group_id FK
    }

    SalesChannel {
      uuid id PK
      text code
      text name
    }

    CustomerSalesChannel {
      uuid id PK
      uuid customer_id FK
      uuid channel_id FK
    }
```

---

## 📦 Жишээ өгөгдөл

### Customer (`customer`)

```json
[
  {
    "id": "cust_001",
    "email": "bat@example.com",
    "first_name": "Бат",
    "last_name": "Болд"
  },
  {
    "id": "cust_002",
    "email": "dulmaa@example.com",
    "first_name": "Дулмаа",
    "last_name": "Эрдэнэ"
  },
  {
    "id": "cust_003",
    "email": "erdene@example.com",
    "first_name": "Эрдэнэ",
    "last_name": "Төмөр"
  }
]
```

---

### CustomerGroup (`customer_group`)

```json
[
  {
    "id": "grp_vip",
    "name": "VIP Customers",
    "description": "Идэвхтэй хэрэглэгчид"
  },
  {
    "id": "grp_wholesale",
    "name": "Wholesale",
    "description": "Бөөний худалдан авагчид"
  }
]
```

---

### CustomerGroupCustomer (`customer_group_customer`)

```json
[
  {
    "id": "cgc_1",
    "customer_id": "cust_001",
    "group_id": "grp_vip"
  },
  {
    "id": "cgc_2",
    "customer_id": "cust_002",
    "group_id": "grp_wholesale"
  }
]
```

---

### SalesChannel (`sales_channel`)

```json
[
  {
    "id": "channel_web",
    "code": "WEB",
    "name": "Online Store"
  },
  {
    "id": "channel_retail",
    "code": "RETAIL",
    "name": "Retail Shop"
  }
]
```

---

### CustomerSalesChannel (`customer_sales_channel`)

```json
[
  {
    "id": "csc_1",
    "customer_id": "cust_001",
    "channel_id": "channel_web"
  },
  {
    "id": "csc_2",
    "customer_id": "cust_001",
    "channel_id": "channel_retail"
  },
  {
    "id": "csc_3",
    "customer_id": "cust_002",
    "channel_id": "channel_web"
  }
]
```

---

## ✅ Дүгнэлт

* `cust_001 (Бат)` → **VIP group**-т харьяалагддаг, Web + Retail хоёуланд нь захиалга хийж чадна.
* `cust_002 (Дулмаа)` → **Wholesale group**-т багтдаг, зөвхөн Web channel-аар худалдан авдаг.
* `cust_003 (Эрдэнэ)` → group болон channel-д хараахан холбогдоогүй.

---
