// src/services/customer.service.js
const db = require('../models');
const { Customer, Sequelize } = db;
const { Op } = Sequelize;

const ALLOWED_STATUSES = new Set(['active', 'inactive', 'deleted', 'suspended', 'pending']);

function strip(row) {
    if (!row) return null;
    const j = row.toJSON ? row.toJSON() : row;
    // Customers ихэнхдээ password байхгүй; байвал нууж буцаая
    delete j.password_hash;
    return j;
}

const CustomerService = {
    /**
     * options:
     *   withGroups?: boolean  (Customer.associations.groups)
     *   withSalesChannels?: boolean (Customer.associations.sales_channels)
     */
    async getById(id, options = {}) {
        const include = [];
        if (options.withGroups && db.CustomerGroup && Customer.associations?.groups) {
            include.push({ model: db.CustomerGroup, as: 'groups' });
        }
        if (options.withSalesChannels && db.SalesChannel && Customer.associations?.sales_channels) {
            include.push({ model: db.SalesChannel, as: 'sales_channels' });
        }
        const row = await Customer.findByPk(id, { include });
        return strip(row);
    },

    /**
     * List + filters
     * params:
     *  q?, email?, phone?, status?, created_from?, created_to?
     *  includeDeleted?=false, limit=50, offset=0
     * options: same as getById
     */
    async list(params = {}, options = {}) {
        const {
            q, email, phone, status, created_from, created_to,
            includeDeleted = false, limit = 50, offset = 0,
            order = [['created_at', 'DESC']],
        } = params;

        const where = {};
        if (q) {
            const like = { [Op.iLike]: `%${q}%` };
            where[Op.or] = [
                { email: like },
                { first_name: like },
                { last_name: like },
                { phone: like },
            ];
        }
        if (email) where.email = email;
        if (phone) where.phone = phone;
        if (status) where.status = status;
        if (created_from) where.created_at = { ...(where.created_at || {}), [Op.gte]: new Date(created_from) };
        if (created_to)   where.created_at = { ...(where.created_at || {}), [Op.lte]: new Date(created_to) };
        if (!includeDeleted) {
            where.status = where.status || { [Op.ne]: 'deleted' };
        }

        const include = [];
        if (options.withGroups && db.CustomerGroup && Customer.associations?.groups) {
            include.push({ model: db.CustomerGroup, as: 'groups', through: { attributes: [] } });
        }
        if (options.withSalesChannels && db.SalesChannel && Customer.associations?.sales_channels) {
            include.push({ model: db.SalesChannel, as: 'sales_channels', through: { attributes: [] } });
        }

        const { rows, count } = await Customer.findAndCountAll({
            where,
            include,
            limit: Number(limit),
            offset: Number(offset),
            order,
        });

        return {
            rows: rows.map(strip),
            count,
        };
    },

    /**
     * Create
     * payload: { email, first_name?, last_name?, phone?, status?, metadata? ... }
     *  - email давхардал шалгана
     */
    async create(payload) {
        await this._assertEmailUnique(payload.email);

        if (payload.status && !ALLOWED_STATUSES.has(payload.status)) {
            throw new Error('Invalid status');
        }

        const row = await Customer.create({
            email: payload.email,
            first_name: payload.first_name,
            last_name: payload.last_name,
            phone: payload.phone,
            status: payload.status || 'active',
            metadata: payload.metadata,
        });

        return strip(row);
    },

    /**
     * Update
     * updates: { email?, first_name?, last_name?, phone?, status?, metadata? }
     */
    async update(id, updates) {
        const row = await Customer.findByPk(id);
        if (!row) throw new Error('Customer not found');

        if (updates.email && updates.email !== row.email) {
            await this._assertEmailUnique(updates.email, id);
        }
        if (updates.status && !ALLOWED_STATUSES.has(updates.status)) {
            throw new Error('Invalid status');
        }

        const safe = { ...updates };
        delete safe.password;
        delete safe.password_hash;

        await row.update(safe);
        return strip(row);
    },

    /**
     * Soft delete → status='deleted'
     */
    async softDelete(id) {
        const row = await Customer.findByPk(id);
        if (!row) throw new Error('Customer not found');
        await row.update({ status: 'deleted' });
        return { ok: true };
    },

    /**
     * Restore deleted customer (default to 'inactive')
     */
    async restore(id, toStatus = 'inactive') {
        if (!ALLOWED_STATUSES.has(toStatus)) throw new Error('Invalid status');
        const row = await Customer.findByPk(id);
        if (!row) throw new Error('Customer not found');
        if (row.status !== 'deleted') throw new Error('Customer is not deleted');
        await row.update({ status: toStatus });
        return strip(row);
    },

    /** Convenient status setter */
    async setStatus(id, status) {
        if (!ALLOWED_STATUSES.has(status)) throw new Error('Invalid status');
        const row = await Customer.findByPk(id);
        if (!row) throw new Error('Customer not found');
        await row.update({ status });
        return strip(row);
    },

    // ---------- Helpers ----------
    async _assertEmailUnique(email, excludeId) {
        const where = excludeId ? { email, id: { [Op.ne]: excludeId } } : { email };
        const dup = await Customer.findOne({ where });
        if (dup) throw new Error('Email is already in use');
    },
};

module.exports = CustomerService;
