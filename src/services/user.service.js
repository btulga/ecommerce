// src/services/user.service.js
const db = require('../models');
const { User, Sequelize } = db;
const { Op } = Sequelize;

const ALLOWED_STATUSES = new Set(['active', 'inactive', 'deleted', 'suspended', 'pending']);

const UserService = {
    // ---------- Helpers ----------
    _filterWhere({ q, email, status, hasRole } = {}) {
        const where = {};
        if (q) {
            const like = { [Op.iLike]: `%${q}%` };
            where[Op.or] = [
                { email: like },
                { first_name: like },
                { last_name: like },
            ];
        }
        if (email) where.email = email;
        if (status) where.status = status;
        if (hasRole) where.roles = { [Op.contains]: [hasRole] }; // Postgres JSONB contains
        return where;
    },

    // ---------- Reads ----------
    async getById(id) {
        const user = await User.findByPk(id);
        return user ? strip(user) : null;
    },

    async list(params = {}) {
        const {
            q, email, status, hasRole,
            limit = 50, offset = 0,
            order = [['created_at', 'DESC']],
            includeDeleted = false,
        } = params;

        const where = this._filterWhere({ q, email, status, hasRole });
        if (!includeDeleted) {
            // deleted-үүдийг нуух
            where.status = where.status || { [Op.ne]: 'deleted' };
        }

        const { rows, count } = await User.findAndCountAll({
            where,
            limit: Number(limit),
            offset: Number(offset),
            order,
            attributes: { exclude: ['password_hash'] },
        });
        return { rows, count };
    },

    // ---------- Create / Update ----------
    /**
     * createUser: { email, password, first_name?, last_name?, roles?[], status?, metadata? }
     * password → model hook дагаж автоматаар hash болно
     */
    async createUser(payload) {
        await this._assertEmailUnique(payload.email);

        if (payload.roles && !Array.isArray(payload.roles)) {
            throw new Error('roles must be an array');
        }
        if (payload.status && !ALLOWED_STATUSES.has(payload.status)) {
            throw new Error('Invalid status');
        }

        const user = await User.create({
            email: payload.email,
            password_hash: payload.password, // hook → hash
            first_name: payload.first_name,
            last_name: payload.last_name,
            roles: payload.roles || [],
            status: payload.status || 'active',
            metadata: payload.metadata,
        });

        return strip(user);
    },

    /**
     * updateUser: { email?, first_name?, last_name?, roles?[], status?, metadata? }
     * password-г энд сольдоггүй (changePassword-аа ашигла)
     */
    async updateUser(id, updates) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        if (updates.email && updates.email !== user.email) {
            await this._assertEmailUnique(updates.email, id);
        }
        if (updates.roles && !Array.isArray(updates.roles)) {
            throw new Error('roles must be an array');
        }
        if (updates.status && !ALLOWED_STATUSES.has(updates.status)) {
            throw new Error('Invalid status');
        }

        const safe = { ...updates };
        delete safe.password;
        delete safe.password_hash;

        await user.update(safe);
        return strip(user);
    },

    // ---------- Password ----------
    /**
     * changePassword (self эсвэл admin)
     * options: { requireCurrent: true/false, current_password?, new_password }
     */
    async changePassword(id, { current_password, new_password }, { requireCurrent = true } = {}) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');

        if (requireCurrent) {
            if (!user.validPassword(current_password)) {
                throw new Error('Current password is incorrect');
            }
        }

        await user.update({ password_hash: new_password }); // hook → hash
        return { ok: true };
    },

    // ---------- Status / Roles ----------
    async setStatus(id, status) {
        if (!ALLOWED_STATUSES.has(status)) throw new Error('Invalid status');
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        await user.update({ status });
        return strip(user);
    },

    async setRoles(id, roles = []) {
        if (!Array.isArray(roles)) throw new Error('roles must be an array');
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        await user.update({ roles });
        return strip(user);
    },

    // ---------- Soft delete / Restore ----------
    async softDelete(id) {
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        await user.update({ status: 'deleted' });
        return { ok: true };
    },

    async restore(id, toStatus = 'inactive') {
        if (!ALLOWED_STATUSES.has(toStatus)) throw new Error('Invalid status');
        const user = await User.findByPk(id);
        if (!user) throw new Error('User not found');
        if (user.status !== 'deleted') throw new Error('User is not deleted');
        await user.update({ status: toStatus });
        return strip(user);
    },

    // ---------- Self ----------
    async getMe(userId) {
        const user = await User.findByPk(userId);
        if (!user || user.status === 'deleted') throw new Error('User not found');
        return strip(user);
    },

    async updateMe(userId, updates) {
        const user = await User.findByPk(userId);
        if (!user || user.status === 'deleted') throw new Error('User not found');

        // Email өөрчлөх бол давхардал шалгана
        if (updates.email && updates.email !== user.email) {
            await this._assertEmailUnique(updates.email, userId);
        }

        // Self update дээр roles/status өөрчлөхийг зөвшөөрөхгүй
        const safe = { ...updates };
        delete safe.roles;
        delete safe.status;
        delete safe.password;
        delete safe.password_hash;

        await user.update(safe);
        return strip(user);
    },

    // ---------- Private ----------
    async _assertEmailUnique(email, excludeId) {
        const where = excludeId
            ? { email, id: { [Op.ne]: excludeId } }
            : { email };
        const dup = await User.findOne({ where });
        if (dup) throw new Error('Email is already in use');
    },
};

function strip(userInstance) {
    const json = userInstance.toJSON();
    delete json.password_hash;
    return json;
}

module.exports = UserService;
