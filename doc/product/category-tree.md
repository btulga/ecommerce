
---

## 📦 Жишээ өгөгдөл

```
Electronics (1, 8)
 ├── Mobile Phones (2, 3)
 ├── Laptops (4, 5)
 └── Accessories (6, 7)
```

### Category (`category` хүснэгт)

```json
[
  {
    "id": "cat_electronics",
    "name": "Electronics",
    "description": "Электроник бараанууд",
    "lft": 1,
    "rgt": 8
  },
  {
    "id": "cat_phones",
    "name": "Mobile Phones",
    "description": "Ухаалаг гар утаснууд",
    "lft": 2,
    "rgt": 3
  },
  {
    "id": "cat_laptops",
    "name": "Laptops",
    "description": "Зөөврийн компьютер",
    "lft": 4,
    "rgt": 5
  },
  {
    "id": "cat_accessories",
    "name": "Accessories",
    "description": "Дагалдах хэрэгсэл",
    "lft": 6,
    "rgt": 7
  }
]
```

---

## ✅ Ашиглалт

👉 `Electronics`-ийн бүх дэд ангийг олох query:

```sql
SELECT * 
FROM category 
WHERE lft BETWEEN 1 AND 8 
  AND id != 'cat_electronics';
```

👉 `Mobile Phones` нь leaf node тул (2,3) → ямар ч хүүхэдгүй.

---

## 🚦 Давуу тал

* Нэг query-ээр бүх subtree-г гаргаж болно.
* Category-г дарааллын дагуу хадгалж чадна.

⚠️ Сул тал нь: insert/update хийхэд бусад мөрийн `lft/rgt`-г shift хийх шаардлагатай.

---
