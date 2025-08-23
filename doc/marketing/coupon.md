
---

## 🏗 Жишээ: Coupon → Benefit (Discount)

### Coupon (`coupon` хүснэгт)

```json
{
  "id": "coupon_back2school2025",
  "code": "BACK2SCHOOL2025",
  "description": "Back to School купон",
  "start_date": "2025-08-20T00:00:00Z",
  "end_date": "2025-09-30T23:59:59Z"
}
```

---

### CouponCondition (`coupon_condition` хүснэгт)

```json
[
  {
    "id": "cond_coupon_channel_web",
    "coupon_id": "coupon_back2school2025",
    "condition_type": "sales_channel",
    "operator": "=",
    "condition_value": "channel_web"
  },
  {
    "id": "cond_coupon_min_total",
    "coupon_id": "coupon_back2school2025",
    "condition_type": "cart_total",
    "operator": "MIN_CART_TOTAL",
    "condition_value": "100000"
  }
]
```


---

### CouponBenefit (`coupon_benefit` хүснэгт)

```json
{
  "id": "benefit_coupon_discount",
  "coupon_id": "coupon_back2school2025",
  "benefit_type": "discount",
  "benefit_value_id": "discount_10percent",
  "value": {}
}
```

---

### Discount (`discount` хүснэгт)

```json
{
  "id": "discount_10percent",
  "discount_type": "percentage",
  "discount_value": 10
}
```

---

## ✅ Логик урсгал

1. Хэрэглэгч coupon код → `BACK2SCHOOL2025` оруулна.
2. Систем `coupon_condition` шалгана (channel\_web + cart\_total ≥ 100k).
3. Нөхцөл зөв бол `coupon_benefit`-ийг дуудаж → `discount_10percent` хэрэгжинэ.

---

👉 Ингэж хуваахад маш уян хатан болно:

* Өөр coupon → өөр discount холбож өгч чадна.
* Нэг coupon → олон benefit холбож чадна (жишээ нь 10% discount + free shipping).

---
