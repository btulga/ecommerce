
---

## 🏗 ER загвар (товчоор)

* `product` → үндсэн бүтээгдэхүүн
* `collection` → бүтээгдэхүүнүүдийг нэгтгэсэн багц (жишээ нь: “Apple Devices”, “Back to School”)
* `product_collection` → N\:N холбоо хадгалах join хүснэгт

```mermaid
erDiagram
    Product ||--o{ ProductCollection : belongs_to
    Collection ||--o{ ProductCollection : has_many
    
    Product {
      uuid id PK
      text title
      text sku
      numeric price
      jsonb metadata
    }

    Collection {
      uuid id PK
      text title
      text description
      jsonb metadata
    }

    ProductCollection {
      uuid id PK
      uuid product_id FK
      uuid collection_id FK
    }
```

---

## 📦 Жишээ өгөгдөл

### Collection (`collection` хүснэгт)

```json
[
  {
    "id": "col_apple",
    "title": "Apple Devices",
    "description": "Apple брэндийн бүх бүтээгдэхүүн",
    "metadata": {}
  },
  {
    "id": "col_back2school",
    "title": "Back to School",
    "description": "Сургуульд бэлдэх багц бүтээгдэхүүн",
    "metadata": {}
  }
]
```

---

### Product (`product` хүснэгт)

```json
[
  {
    "id": "prod_iphone15",
    "title": "iPhone 15",
    "sku": "IPH15-256-BLK",
    "price": 3500000,
    "metadata": { "color": "black", "storage": "256GB" }
  },
  {
    "id": "prod_macbookair",
    "title": "MacBook Air M2",
    "sku": "MBA-M2-13",
    "price": 4500000,
    "metadata": { "ram": "16GB", "ssd": "512GB" }
  },
  {
    "id": "prod_powerbank",
    "title": "Anker PowerBank 10000mAh",
    "sku": "ANK-PB10000",
    "price": 150000,
    "metadata": { "color": "white" }
  }
]
```

---

### ProductCollection (`product_collection` хүснэгт)

```json
[
  {
    "id": "pc_1",
    "product_id": "prod_iphone15",
    "collection_id": "col_apple"
  },
  {
    "id": "pc_2",
    "product_id": "prod_macbookair",
    "collection_id": "col_apple"
  },
  {
    "id": "pc_3",
    "product_id": "prod_powerbank",
    "collection_id": "col_back2school"
  },
  {
    "id": "pc_4",
    "product_id": "prod_iphone15",
    "collection_id": "col_back2school"
  }
]
```

---

## ✅ Дүгнэлт

* `iPhone 15` → `Apple Devices` + `Back to School` хоёр collection-д багтсан
* `MacBook Air` → зөвхөн `Apple Devices`
* `PowerBank` → зөвхөн `Back to School`

---
