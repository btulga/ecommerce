// src/services/user-auth.service.js
const db = require('../models');
const jwt = require('jsonwebtoken');
const { User, Sequelize } = db;
const { Op } = Sequelize;

function signAccessToken(payload, opts = {}) {
    const secret = process.env.JWT_SECRET || 'change-me';
    const expiresIn = opts.expiresIn || process.env.JWT_EXPIRES_IN || '1h';
    return jwt.sign(payload, secret, { expiresIn });
}

function strip(user) {
    const j = user.toJSON();
    delete j.password_hash;
    return j;
}

const UserAuthService = {
    /**
     * Ердийн хэрэглэгч нэвтрэх
     * { email, password } -> { token, user }
     */
    async login({ email, password }) {
        const user = await User.findOne({
            where: { email, status: { [Op.ne]: 'deleted' } },
        });
        if (!user) throw new Error('Invalid credentials');

        if (user.status !== 'active') {
            throw new Error('Account is not active');
        }

        const ok = user.validPassword(password);
        if (!ok) throw new Error('Invalid credentials');

        await user.update({ last_login_at: new Date() });

        const token = signAccessToken({ sub: user.id, roles: user.roles || [], type: 'access' });
        return { token, user: strip(user) };
    },

    /** (сонголт) өөрийн мэдээлэл — JWT-ээс */
    async me(userId) {
        const user = await User.findByPk(userId);
        if (!user || user.status === 'deleted') throw new Error('User not found');
        return strip(user);
    },
};

module.exports = UserAuthService;
