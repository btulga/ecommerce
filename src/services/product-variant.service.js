// src/services/product-variant.service.js
const db = require('../models');
const { ProductVariant, ProductVariantOptionValue, ProductOptionValue, ProductOption } = db;

const ProductVariantService = {
    async createVariant(productId, data) {
        return await ProductVariant.create({
            ...data,
            product_id: productId,
            attributes: {},
        });
    },

    async getVariantById(id) {
        return await ProductVariant.findByPk(id, {
            include: [{
                model: ProductOptionValue,
                as: 'option_values',
                include: [{ model: ProductOption, as: 'option' }]
            }],
        });
    },

    async updateVariant(id, updates) {
        const variant = await ProductVariant.findByPk(id);
        if (!variant) throw new Error('Product variant not found');
        return await variant.update(updates);
    },

    async deleteVariant(id) {
        const variant = await ProductVariant.findByPk(id);
        if (!variant) throw new Error('Product variant not found');
        await variant.destroy();
        return true;
    },

    /**
     * Variant-д option value нэмэх
     * → product_variant_option_value холбоо үүсгэнэ
     * → attributes талбарыг шинэчилнэ
     */
    async addOptionValue(variantId, optionValueId) {
        const variant = await ProductVariant.findByPk(variantId);
        if (!variant) throw new Error('Variant not found');

        const optionValue = await ProductOptionValue.findByPk(optionValueId, {
            include: [{ model: ProductOption, as: 'option' }],
        });
        if (!optionValue) throw new Error('Option value not found');

        // холбоо нэмэх
        await ProductVariantOptionValue.create({
            product_variant_id: variantId,
            product_option_value_id: optionValueId,
        });

        // attributes шинэчлэх
        const attributes = { ...(variant.attributes || {}) };
        attributes[optionValue.option.name] = optionValue.value;

        await variant.update({ attributes });

        return variant;
    },

    /**
     * Variant-с option value устгах
     * → холбоо устгана
     * → attributes талбарыг шинэчилнэ
     */
    async removeOptionValue(variantId, optionValueId) {
        const variant = await ProductVariant.findByPk(variantId);
        if (!variant) throw new Error('Variant not found');

        const optionValue = await ProductOptionValue.findByPk(optionValueId, {
            include: [{ model: ProductOption, as: 'option' }],
        });
        if (!optionValue) throw new Error('Option value not found');

        // холбоо устгах
        await ProductVariantOptionValue.destroy({
            where: {
                product_variant_id: variantId,
                product_option_value_id: optionValueId,
            },
        });

        // attributes-с устгах
        const attributes = { ...(variant.attributes || {}) };
        delete attributes[optionValue.option.name];

        await variant.update({ attributes });

        return variant;
    },
};

module.exports = ProductVariantService;
