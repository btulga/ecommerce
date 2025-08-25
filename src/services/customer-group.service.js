// src/services/customer-group.service.js
const db = require('../models');
const { CustomerGroup, Customer } = db;

const CustomerGroupService = {
    /**
     * Group үүсгэх
     * data: { name, description?, metadata? }
     */
    async createGroup(data) {
        return await CustomerGroup.create(data);
    },

    /**
     * Нэг group (+customers) авах
     */
    async getGroupById(id) {
        return await CustomerGroup.findByPk(id, {
            include: [{ model: Customer, as: 'customers' }],
        });
    },

    /**
     * Бүх group-ууд (сонголтоор customers-тай)
     */
    async listGroups({ withCustomers = false } = {}) {
        return await CustomerGroup.findAll({
            include: withCustomers ? [{ model: Customer, as: 'customers' }] : [],
            order: [['created_at', 'DESC']],
        });
    },

    /**
     * Group update
     */
    async updateGroup(id, updates) {
        const grp = await CustomerGroup.findByPk(id);
        if (!grp) throw new Error('CustomerGroup not found');
        return await grp.update(updates);
    },

    /**
     * Group устгах
     *  - FK CASCADE байгаа бол холбоосууд автоматаар цэвэрлэгдэнэ
     */
    async deleteGroup(id) {
        const deleted = await CustomerGroup.destroy({ where: { id } });
        if (deleted === 0) throw new Error('CustomerGroup not found');
        return true;
    },

    /**
     * Customer-ийг group-д нэмэх
     */
    async addCustomer(groupId, customerId) {
        const [grp, cust] = await Promise.all([
            CustomerGroup.findByPk(groupId),
            Customer.findByPk(customerId),
        ]);
        if (!grp) throw new Error('CustomerGroup not found');
        if (!cust) throw new Error('Customer not found');

        // CustomerGroup.belongsToMany(Customer, { as: 'customers', through: 'customer_group_customer' })
        await grp.addCustomer(cust);
        return await this.getGroupById(groupId);
    },

    /**
     * Customer-ийг group-с хасах
     */
    async removeCustomer(groupId, customerId) {
        const [grp, cust] = await Promise.all([
            CustomerGroup.findByPk(groupId),
            Customer.findByPk(customerId),
        ]);
        if (!grp) throw new Error('CustomerGroup not found');
        if (!cust) throw new Error('Customer not found');

        await grp.removeCustomer(cust);
        return await this.getGroupById(groupId);
    },

    /**
     * Customers sync (өгөгдсөн customers[] id жагсаалтыг бүрэн тольдож тохируулна)
     */
    async setCustomers(groupId, customerIds = []) {
        const grp = await CustomerGroup.findByPk(groupId);
        if (!grp) throw new Error('CustomerGroup not found');

        const customers = await Customer.findAll({ where: { id: customerIds } });
        await grp.setCustomers(customers);
        return await this.getGroupById(groupId);
    },
};

module.exports = CustomerGroupService;
