// src/middlewares/auth.middleware.js
const jwt = require('jsonwebtoken');

/**
 * Access token шалгах middleware
 * - Header: Authorization: Bearer <token>
 * - Payload: { sub: userId, roles: [...], type: 'access' }
 */
function authRequired(req, res, next) {
    try {
        const hdr = req.headers.authorization || '';
        const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
        if (!token) {
            return res.status(401).json({ error: 'Missing token' });
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET || 'change-me');
        req.user = {
            id: payload.sub,
            roles: payload.roles || [],
        };
        next();
    } catch (e) {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
}

/**
 * Нэг роль шаарддаг guard
 * @param {string} role - жишээ: 'ADMIN', 'USER'
 */
function hasRole(role) {
    return (req, res, next) => {
        if (!req.user?.roles?.includes(role)) {
            return res.status(403).json({ error: `Requires role ${role}` });
        }
        next();
    };
}

/**
 * Олон рольд аль нэг нь байвал зөвшөөрнө
 * @param {string[]} roles
 */
function hasAnyRole(roles = []) {
    return (req, res, next) => {
        const userRoles = req.user?.roles || [];
        const ok = roles.some((r) => userRoles.includes(r));
        if (!ok) {
            return res.status(403).json({ error: `Requires any of roles: ${roles.join(', ')}` });
        }
        next();
    };
}

/**
 * Admin-only middleware
 */
const adminOnly = hasRole('ADMIN');

/**
 * User manager-only middleware
 * (жишээ нь админ хэрэглэгчдийг удирдах эрхтэй ROLE_USER)
 */
const userManagerOnly = hasRole('USER');

/**
 * Admin эсвэл User Manager аль нэг нь байхад зөвшөөрөх
 */
const adminOrUserManager = hasAnyRole(['ADMIN', 'USER']);

module.exports = {
    authRequired,
    hasRole,
    hasAnyRole,
    adminOnly,
    userManagerOnly,
    adminOrUserManager,
};
