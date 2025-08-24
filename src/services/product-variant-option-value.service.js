// src/services/product-variant-option-value.service.js
const db = require('../models');
const { ProductVariantOptionValue } = db;

const ProductVariantOptionValueService = {
    async linkVariantToOptionValue(variantId, optionValueId) {
        return await ProductVariantOptionValue.create({
            product_variant_id: variantId,
            product_option_value_id: optionValueId,
        });
    },

    async unlinkVariantFromOptionValue(variantId, optionValueId) {
        return await ProductVariantOptionValue.destroy({
            where: {
                product_variant_id: variantId,
                product_option_value_id: optionValueId,
            },
        });
    },
};

module.exports = ProductVariantOptionValueService;
