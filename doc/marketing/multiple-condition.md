Өө сайн кейс 👌 “**тодорхой sales channel-аас тодорхой 2 бүтээгдэхүүн авбал урамшуулал олгох**” гэдэг нь энгийн coupon/free\_shipping-аас арай илүү **нөхцөл (condition)** логик болж байна.

---

## 📌 Одоогийн schema-г сануулбал

* `promotion` → үндсэн мэдээлэл
* `promotion_benefit` → урамшууллын төрлүүд (coupon, gift, discount, shipping)
* `promotion_condition` (одоохондоо ярьж байгаагүй ч ер нь хэрэгтэй)

---

## 🏗 Шийдэл: `promotion_condition` хүснэгт нэмэх

Урамшуулал хэзээ хэрэгжихийг **condition** хүснэгтээр удирдах нь хамгийн зөв.

### promotion\_condition

| column           | type      | тайлбар                                                                              |
| ---------------- | --------- | ------------------------------------------------------------------------------------ |
| id               | uuid PK   |                                                                                      |
| promotion\_id    | uuid FK   | ямар promotion-той холбоотой                                                         |
| condition\_type  | text      | `"sales_channel"`, `"product"`, `"cart_total"`, `"customer_group"` гэх мэт           |
| condition\_value | uuid/json | тухайн нөхцлийн утга (жишээ: sales\_channel\_id, product\_id, min\_quantity гэх мэт) |
| operator         | text      | `=, IN, >=, <=` гэх мэт                                                              |

---

## 📦 Жишээ:

**Rule** → “Online Store (sales\_channel\_id = `channel_web`) дээр iPhone 15 + MacBook Air хоёуланг авбал PowerBank үнэгүй дагалдана”

### Promotion

```json
{
  "id": "promo_apple_bundle",
  "name": "Apple Bundle Promo",
  "description": "Онлайн дэлгүүрээс iPhone 15 + MacBook Air авбал PowerBank үнэгүй",
  "start_date": "2025-09-01T00:00:00Z",
  "end_date": "2025-12-31T23:59:59Z"
}
```

### PromotionBenefit

```json
{
  "id": "benefit_gift_powerbank",
  "promotion_id": "promo_apple_bundle",
  "benefit_type": "gift",
  "benefit_value_id": "product_powerbank_10000mah",
  "value": {
    "quantity": 1
  }
}
```

### PromotionCondition

```json
[
  {
    "id": "cond_channel",
    "promotion_id": "promo_apple_bundle",
    "condition_type": "sales_channel",
    "condition_value": "channel_web",
    "operator": "="
  },
  {
    "id": "cond_product_iphone15",
    "promotion_id": "promo_apple_bundle",
    "condition_type": "product",
    "condition_value": "product_iphone15",
    "operator": "IN_CART"
  },
  {
    "id": "cond_product_macbookair",
    "promotion_id": "promo_apple_bundle",
    "condition_type": "product",
    "condition_value": "product_macbookair",
    "operator": "IN_CART"
  }
]
```

👉 Энд 3 нөхцөл зэрэг биелсэн үед (`channel_web` + iPhone 15 cart дотор байна + MacBook Air cart дотор байна) → **gift benefit** ажиллана.

---

## 🚦 Дүгнэлт

* **Тодорхой нөхцөлүүд дээр урамшуулал олгох** бол `promotion_condition` хүснэгт нэмэх нь зайлшгүй.
* `promotion_benefit` зөвхөн **ямар reward өгч байгаа вэ** гэдгийг тодорхойлно.
* `promotion_condition` бол **хэзээ / ямар нөхцөлд ажиллах вэ** гэдгийг тодорхойлно.

---

Чи хүсвэл би `promotion_condition` хүснэгтийн **PostgreSQL migration + Sequelize model**-ийг жишээтэйгээр бичээд өгч болох уу?
