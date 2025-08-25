// src/services/cart.service.js
const db = require('../models');
const { sequelize, Sequelize, Cart, CartItem, Customer, Address, ProductVariant } = db;
const { Op } = Sequelize;

/**
 * Тэмдэглэл:
 * - Cart: { id, customer_id?, currency_code, status('draft'|'active'|'completed'|'canceled'), subtotal, total, shipping_total, discount_total, tax_total, shipping_address JSONB, billing_address JSONB, metadata }
 * - CartItem: { id, cart_id, variant_id, quantity, unit_price, total, metadata }
 * - ProductVariant: { id, price, currency_code, ... }
 */

const CartService = {
    // ---------------- Core reads ----------------
    async getCartById(id) {
        return await Cart.findByPk(id, {
            include: [
                { model: CartItem, as: 'items', include: [{ model: ProductVariant, as: 'variant' }] },
                { model: Customer, as: 'customer' },
            ],
        });
    },

    async getActiveCartByCustomer(customer_id) {
        return await Cart.findOne({
            where: { customer_id, status: { [Op.in]: ['draft', 'active'] } },
            order: [['updated_at', 'DESC']],
            include: [{ model: CartItem, as: 'items', include: [{ model: ProductVariant, as: 'variant' }] }],
        });
    },

    // ---------------- Create / Update ----------------
    async createCart({ customer_id = null, currency_code = 'MNT', metadata } = {}) {
        if (customer_id) await ensureCustomer(customer_id);
        const cart = await Cart.create({
            customer_id,
            currency_code,
            status: 'draft',
            subtotal: 0,
            discount_total: 0,
            shipping_total: 0,
            tax_total: 0,
            total: 0,
            metadata,
        });
        return this.getCartById(cart.id);
    },

    async setCustomer(cart_id, customer_id) {
        await ensureCustomer(customer_id);
        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');
        if (!['draft', 'active'].includes(cart.status)) throw new Error('Cart is not editable');
        await cart.update({ customer_id });
        return this.getCartById(cart_id);
    },

    async setCurrency(cart_id, currency_code) {
        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');
        await cart.update({ currency_code });
        // (санал) item.unit_price валют тохируулалт хийх хэрэгтэй бол энд шийд
        return this.getCartById(cart_id);
    },

    // ---------------- Items ----------------
    async addItem(cart_id, { variant_id, quantity = 1, unit_price = null, metadata } = {}) {
        if (quantity <= 0) throw new Error('quantity must be > 0');

        return await sequelize.transaction(async (t) => {
            const cart = await Cart.findByPk(cart_id, { transaction: t });
            if (!cart) throw new Error('Cart not found');
            if (!['draft', 'active'].includes(cart.status)) throw new Error('Cart is not editable');

            const variant = await ProductVariant.findByPk(variant_id, { transaction: t });
            if (!variant) throw new Error('Variant not found');

            const price = unit_price != null ? Number(unit_price) : Number(variant.price || 0);

            // Upsert (same variant → increase qty)
            let item = await CartItem.findOne({ where: { cart_id, variant_id }, transaction: t });
            if (item) {
                const newQty = Number(item.quantity) + Number(quantity);
                await item.update({ quantity: newQty, unit_price: price, total: price * newQty, metadata }, { transaction: t });
            } else {
                item = await CartItem.create(
                    { cart_id, variant_id, quantity, unit_price: price, total: price * quantity, metadata },
                    { transaction: t }
                );
            }

            await recalcTotals(cart_id, { transaction: t });
            return await CartItem.findByPk(item.id, {
                include: [{ model: ProductVariant, as: 'variant' }],
                transaction: t,
            });
        });
    },

    async updateItemQuantity(cart_id, item_id, quantity) {
        if (quantity <= 0) throw new Error('quantity must be > 0');

        return await sequelize.transaction(async (t) => {
            const item = await CartItem.findOne({ where: { id: item_id, cart_id }, transaction: t });
            if (!item) throw new Error('Cart item not found');
            const unit = Number(item.unit_price || 0);
            await item.update({ quantity, total: unit * quantity }, { transaction: t });
            await recalcTotals(cart_id, { transaction: t });
            return item;
        });
    },

    async removeItem(cart_id, item_id) {
        return await sequelize.transaction(async (t) => {
            const n = await CartItem.destroy({ where: { id: item_id, cart_id }, transaction: t });
            if (n === 0) throw new Error('Cart item not found');
            await recalcTotals(cart_id, { transaction: t });
            return true;
        });
    },

    async setItemMetadata(cart_id, item_id, metadata = {}) {
        const item = await CartItem.findOne({ where: { id: item_id, cart_id } });
        if (!item) throw new Error('Cart item not found');
        await item.update({ metadata });
        return item;
    },

    // ---------------- Addresses (snapshot) ----------------
    /**
     * Хаягийг cart дээр JSONB snapshot болгон хадгална (адрессыг өөрчилсөн ч cart дээр үлдэнэ)
     */
    async setShippingAddress(cart_id, address_id) {
        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');
        const addr = await Address.findByPk(address_id);
        if (!addr) throw new Error('Address not found');

        await cart.update({ shipping_address: snapshotAddress(addr) });
        return this.getCartById(cart_id);
    },

    async setBillingAddress(cart_id, address_id) {
        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');
        const addr = await Address.findByPk(address_id);
        if (!addr) throw new Error('Address not found');

        await cart.update({ billing_address: snapshotAddress(addr) });
        return this.getCartById(cart_id);
    },

    // ---------------- Totals ----------------
    /**
     * Хөнгөлөлт/татвар/шуудангийн дүнг гаднаас тооцдог бол энд override хийж болно.
     */
    async overrideTotals(cart_id, { shipping_total, discount_total, tax_total }) {
        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');

        const patch = {};
        if (shipping_total != null) patch.shipping_total = Number(shipping_total);
        if (discount_total != null) patch.discount_total = Number(discount_total);
        if (tax_total != null) patch.tax_total = Number(tax_total);

        await cart.update(patch);
        await recalcTotals(cart_id);
        return this.getCartById(cart_id);
    },

    // ---------------- Status / metadata ----------------
    async setStatus(cart_id, status) {
        const allowed = new Set(['draft', 'active', 'completed', 'canceled']);
        if (!allowed.has(status)) throw new Error('Invalid status');

        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');

        await cart.update({ status });
        return this.getCartById(cart_id);
    },

    async setMetadata(cart_id, metadata = {}) {
        const cart = await Cart.findByPk(cart_id);
        if (!cart) throw new Error('Cart not found');
        await cart.update({ metadata });
        return this.getCartById(cart_id);
    },
};

/** ---------- Helpers ---------- */

async function recalcTotals(cart_id, { transaction } = {}) {
    const items = await CartItem.findAll({ where: { cart_id }, transaction });
    const subtotal = items.reduce((s, it) => s + Number(it.total || 0), 0);

    const cart = await Cart.findByPk(cart_id, { transaction });
    const shipping = Number(cart.shipping_total || 0);
    const discount = Number(cart.discount_total || 0);
    const tax = Number(cart.tax_total || 0);

    const total = Math.max(0, subtotal + shipping + tax - discount);
    await cart.update({ subtotal, total }, { transaction });
    return { subtotal, total };
}

function snapshotAddress(a) {
    const j = a.toJSON ? a.toJSON() : a;
    const {
        id, customer_id, created_at, updated_at, // omit ids/timestamps
        ...rest
    } = j;
    return rest;
}

async function ensureCustomer(id) {
    const c = await Customer.findByPk(id);
    if (!c) throw new Error('Customer not found');
    return c;
}

module.exports = CartService;
