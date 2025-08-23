
---

## 📌 `promotion_condition.operator` боломжит утгууд

### 🎯 Ерөнхий харьцуулалт

* `=` → яг тэнцүү
* `!=` → тэнцүү биш
* `IN` → олон утгын жагсаалтад багтаж байгаа эсэх
* `NOT_IN` → жагсаалтад байхгүй эсэх

### 🛒 Cart/Order нөхцөл

* `IN_CART` → тухайн product/cart item заавал сагсанд байх
* `NOT_IN_CART` → тухайн product/cart item байхгүй байх
* `MIN_QTY` → тухайн product-ийн тоо хамгийн багадаа ≥ n
* `MAX_QTY` → тухайн product-ийн тоо хамгийн ихдээ ≤ n
* `MIN_CART_TOTAL` → cart нийт дүн ≥ x
* `MAX_CART_TOTAL` → cart нийт дүн ≤ x

### 👥 Customer нөхцөл

* `IN_GROUP` → тухайн хэрэглэгч тодорхой group-д харьяалагдах
* `NOT_IN_GROUP` → тухайн хэрэглэгч group-д харьяалагдахгүй

### 📦 Channel/Shipping нөхцөл

* `CHANNEL_EQ` → sales\_channel яг тэнцүү
* `CHANNEL_IN` → sales\_channel жагсаалтад багтсан байх
* `SHIPPING_METHOD_EQ` → хүргэлтийн арга яг тэнцүү
* `SHIPPING_METHOD_IN` → хүргэлтийн арга жагсаалтад багтсан байх

### 📅 Хугацааны нөхцөл

(энэ нь promotion өөр дээрээ ихэвчлэн байдаг ч condition болгож бас хэрэглэж болно)

* `DATE_BEFORE` → order огноо X-ээс өмнө
* `DATE_AFTER` → order огноо X-ээс хойш

---

## 📦 Жишээ: “Online channel дээр 2 product байвал gift өгнө”

```json
[
  {
    "condition_type": "sales_channel",
    "condition_value": "channel_web",
    "operator": "="
  },
  {
    "condition_type": "product",
    "condition_value": "product_iphone15",
    "operator": "IN_CART"
  },
  {
    "condition_type": "product",
    "condition_value": "product_macbookair",
    "operator": "IN_CART"
  }
]
```

---

## ✅ Дүгнэлт

* `promotion_condition.operator`-ын жагсаалт нь таны системийн уян хатан байдлаас хамаараад өргөжих боломжтой.
* Эхний ээлжинд: `=, !=, IN, NOT_IN, IN_CART, MIN_QTY, MIN_CART_TOTAL` зэрэг **хамгийн их хэрэглэгдэх** операторуудаас эхлэхийг зөвлөе.

---

👉 Чи хүсвэл би дээрхийг PostgreSQL дээр `CHECK` constraint бүхий **enum төрөл болгож** migration бэлдэж өгч болох уу?
