
---

## 🏗 ER загвар

```mermaid
erDiagram
    Product ||--o{ ProductCategory : belongs_to
    Category ||--o{ ProductCategory : has_many
    
    Product {
      uuid id PK
      text title
      text sku
      numeric price
    }

    Category {
      uuid id PK
      text name
      text description
      uuid parent_id FK "subcategory-н structure хийхэд хэрэглэнэ"
    }

    ProductCategory {
      uuid product_id PK, FK
      uuid category_id PK, FK
    }
```

> `product_id` ба `category_id` нь нийлээд нийлмэл анхдагч түлхүүрийг бүрдүүлнэ.

---

## 📦 Жишээ өгөгдөл

### Category (`category` хүснэгт)

```json
[
  {
    "id": "cat_electronics",
    "name": "Electronics",
    "description": "Электроник бараанууд",
    "parent_id": null
  },
  {
    "id": "cat_phones",
    "name": "Mobile Phones",
    "description": "Ухаалаг гар утаснууд",
    "parent_id": "cat_electronics"
  },
  {
    "id": "cat_laptops",
    "name": "Laptops",
    "description": "Зөөврийн компьютер",
    "parent_id": "cat_electronics"
  },
  {
    "id": "cat_accessories",
    "name": "Accessories",
    "description": "Дагалдах хэрэгсэл",
    "parent_id": "cat_electronics"
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
    "price": 3500000
  },
  {
    "id": "prod_macbookair",
    "title": "MacBook Air M2",
    "sku": "MBA-M2-13",
    "price": 4500000
  },
  {
    "id": "prod_powerbank",
    "title": "Anker PowerBank 10000mAh",
    "sku": "ANK-PB10000",
    "price": 150000
  }
]
```

---

### ProductCategory (`product_category` хүснэгт)

```json
[
  {
    "product_id": "prod_iphone15",
    "category_id": "cat_phones"
  },
  {
    "product_id": "prod_macbookair",
    "category_id": "cat_laptops"
  },
  {
    "product_id": "prod_powerbank",
    "category_id": "cat_accessories"
  }
]
```

---

## ✅ Дүгнэлт

* `Electronics` → parent category

    * `Mobile Phones` → `iPhone 15`
    * `Laptops` → `MacBook Air`
    * `Accessories` → `PowerBank`

---

