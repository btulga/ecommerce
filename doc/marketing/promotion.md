## 📦 Жишээ

### Promotion

```json
{
  "id": "promo_vip_bundle",
  "campaign_id": "camp_vip2025",
  "name": "VIP Bundle",
  "description": "VIP хэрэглэгчдэд купон, үнэгүй хүргэлт, бэлэг бараа",
  "start_date": "2025-09-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z"
}
```

### PromotionBenefit

```json
[
  {
    "id": "benefit_coupon_vip",
    "promotion_id": "promo_vip_bundle",
    "benefit_type": "coupon",
    "benefit_value_id": "coupon_vip2025",
    "value": {}
  },
  {
    "id": "benefit_shipping_vip",
    "promotion_id": "promo_vip_bundle",
    "benefit_type": "free_shipping",
    "benefit_value_id": 50000,
    "value": {
      "min_order_amount": 50000
    }
  },
  {
    "id": "benefit_gift_vip",
    "promotion_id": "promo_vip_bundle",
    "benefit_type": "gift",
    "benefit_value_id": "product_powerbank_10000mah",
    "value": {
      "quantity": 1
    }
  }
]
```

