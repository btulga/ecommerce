
---

## 📌 `coupon_condition.operator` боломжит утгууд

### 🎯 Ерөнхий

* `=` → яг тэнцүү
* `!=` → тэнцүү биш
* `IN` → жагсаалтад багтсан эсэх
* `NOT_IN` → жагсаалтад байхгүй эсэх

### 🛒 Cart нөхцөл

* `MIN_CART_TOTAL` → нийт захиалгын дүн ≥ X
* `MAX_CART_TOTAL` → нийт захиалгын дүн ≤ X
* `IN_CART` → тухайн product/cart item заавал байх
* `NOT_IN_CART` → тухайн product/cart item байхгүй байх
* `MIN_QTY` → тухайн product ≥ n ширхэг байх
* `MAX_QTY` → тухайн product ≤ n ширхэг байх

### 👥 Customer нөхцөл

* `IN_GROUP` → тодорхой хэрэглэгчийн group-д байх
* `NOT_IN_GROUP` → тухайн group-д ороогүй байх
* `NEW_CUSTOMER` → шинээр бүртгүүлсэн хэрэглэгч
* `RETURNING_CUSTOMER` → өмнө нь захиалга хийж байсан хэрэглэгч

### 📦 Channel / Shipping нөхцөл

* `CHANNEL_EQ` → sales\_channel яг тэнцүү
* `CHANNEL_IN` → sales\_channel жагсаалтад байх
* `SHIPPING_METHOD_EQ` → хүргэлтийн арга яг тэнцүү
* `SHIPPING_METHOD_IN` → хүргэлтийн арга жагсаалтад байх

### 📅 Хугацаа

* `DATE_BEFORE` → захиалгын огноо X-ээс өмнө
* `DATE_AFTER` → захиалгын огноо X-ээс хойш

---

## 📦 Жишээ: Coupon зөвхөн Online Channel + 100,000₮-с дээш үед ажиллах

```json
[
  {
    "condition_type": "sales_channel",
    "operator": "=",
    "condition_value": "channel_web"
  },
  {
    "condition_type": "cart_total",
    "operator": "MIN_CART_TOTAL",
    "condition_value": "100000"
  }
]
```

---

👉 Ингэснээр `promotion_condition` болон `coupon_condition` хоёрын операторууд үндсэндээ адилхан логикоор явна. Зөвхөн `promotion` нь олон benefit-г trigger хийхэд хэрэглэгдэнэ, `coupon` бол хэрэглэгчийн оруулсан кодод шууд хамааралтай.

Чи хүсвэл би `promotion_condition` болон `coupon_condition`-ийн \*\*operator-уудыг Postgres `ENUM` төрөл болгож migration бичээд өгөх үү?
