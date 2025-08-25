// src/services/address.service.js
const db = require('../models');
const { sequelize, Sequelize, Address, Customer } = db;
const { Op } = Sequelize;

const AddressService = {
    /**
     * Нэг customer дээр хаяг үүсгэх
     * data: { first_name?, last_name?, phone?, country_code?, city?, address_1?, address_2?, postal_code?, company?, is_default_shipping?, is_default_billing?, metadata? }
     */
    async createAddress(customer_id, data) {
        await ensureCustomer(customer_id);
        return await sequelize.transaction(async (t) => {
            // default-уудыг unique байлгах
            if (data.is_default_shipping) {
                await Address.update({ is_default_shipping: false }, { where: { customer_id }, transaction: t });
            }
            if (data.is_default_billing) {
                await Address.update({ is_default_billing: false }, { where: { customer_id }, transaction: t });
            }
            const row = await Address.create({ ...data, customer_id }, { transaction: t });
            return row;
        });
    },

    async getAddressById(id) {
        return await Address.findByPk(id);
    },

    async listAddressesByCustomer(customer_id) {
        return await Address.findAll({
            where: { customer_id },
            order: [
                ['is_default_shipping', 'DESC'],
                ['is_default_billing', 'DESC'],
                ['created_at', 'DESC'],
            ],
        });
    },

    async updateAddress(id, updates = {}) {
        const row = await Address.findByPk(id);
        if (!row) throw new Error('Address not found');

        return await sequelize.transaction(async (t) => {
            if (updates.is_default_shipping) {
                await Address.update(
                    { is_default_shipping: false },
                    { where: { customer_id: row.customer_id }, transaction: t }
                );
            }
            if (updates.is_default_billing) {
                await Address.update(
                    { is_default_billing: false },
                    { where: { customer_id: row.customer_id }, transaction: t }
                );
            }
            await row.update(updates, { transaction: t });
            return row;
        });
    },

    async deleteAddress(id) {
        const n = await Address.destroy({ where: { id } });
        if (n === 0) throw new Error('Address not found');
        return true;
    },

    async setDefaultShipping(customer_id, address_id) {
        await ensureCustomer(customer_id);
        const addr = await Address.findOne({ where: { id: address_id, customer_id } });
        if (!addr) throw new Error('Address not found');

        await sequelize.transaction(async (t) => {
            await Address.update({ is_default_shipping: false }, { where: { customer_id }, transaction: t });
            await addr.update({ is_default_shipping: true }, { transaction: t });
        });
        return addr;
    },

    async setDefaultBilling(customer_id, address_id) {
        await ensureCustomer(customer_id);
        const addr = await Address.findOne({ where: { id: address_id, customer_id } });
        if (!addr) throw new Error('Address not found');

        await sequelize.transaction(async (t) => {
            await Address.update({ is_default_billing: false }, { where: { customer_id }, transaction: t });
            await addr.update({ is_default_billing: true }, { transaction: t });
        });
        return addr;
    },
};

async function ensureCustomer(id) {
    const c = await Customer.findByPk(id);
    if (!c) throw new Error('Customer not found');
    return c;
}

module.exports = AddressService;
