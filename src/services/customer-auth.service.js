// src/services/customer-auth.service.js
const db = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { Customer, Sequelize } = db;
const { Op } = Sequelize;

function signAccessToken(payload, opts = {}) {
    const secret = process.env.JWT_SECRET || 'change-me';
    const expiresIn = opts.expiresIn || process.env.JWT_EXPIRES_IN || '7d';
    return jwt.sign(payload, secret, { expiresIn });
}

function strip(row) {
    const j = row.toJSON();
    delete j.password_hash;
    return j;
}

const CustomerAuthService = {
    /**
     * { email, password } -> { token, customer }
     */
    async login({ email, password }) {
        const customer = await Customer.findOne({
            where: { email, status: { [Op.ne]: 'deleted' } },
        });
        if (!customer) throw new Error('Invalid credentials');

        if (customer.status !== 'active') {
            throw new Error('Account is not active');
        }

        // Хэрэв Customer модел дээр validPassword байгаа бол ашиглая
        let ok = false;
        if (typeof customer.validPassword === 'function') {
            ok = customer.validPassword(password);
        } else {
            ok = await bcrypt.compare(password, customer.password_hash || '');
        }
        if (!ok) throw new Error('Invalid credentials');

        await customer.update({ last_login_at: new Date() });

        const token = signAccessToken({
            sub: customer.id,
            roles: ['CUSTOMER'], // customer token
            type: 'access',
        });

        return { token, customer: strip(customer) };
    },

    async me(customerId) {
        const customer = await Customer.findByPk(customerId);
        if (!customer || customer.status === 'deleted') throw new Error('Customer not found');
        return strip(customer);
    },
};

module.exports = CustomerAuthService;
