// src/routes/user-routes.js
const express = require('express');
const UserController = require('../controllers/user.controller');
const { authRequired, adminOnly, userManagerOnly } = require('../middlewares/auth.middleware');

const router = express.Router();

/**
 * Self (login хийсэн хэрэглэгч)
 */
router.get('/users/me', authRequired, UserController.me);
router.put('/users/me', authRequired, UserController.updateMe);
router.post('/users/me/change-password', authRequired, UserController.changeMyPassword);

/**
 * Admin-side user management
 * - Доорхт хандах эрхийг та хүссэнээрээ тохируулж болно:
 *   * adminOnly → зөвхөн ADMIN роль
 *   * userManagerOnly → USER роль (админ удирдлагын эрх) гэх мэт
 * Энд жишээ болгон хоёуланг нь зөвшөөрөхөөр (аль нэг байхад) middleware зохион байгуулахыг зөвлөе.
 */

// Жишээ: зөвхөн ADMIN эсвэл USER (user manager) аль нэг байхад зөвшөөрөх комбини middleware
function adminOrUserManager(req, res, next) {
    const roles = req.user?.roles || [];
    if (roles.includes('ADMIN') || roles.includes('USER')) return next();
    return res.status(403).json({ error: 'Requires role ADMIN or USER' });
}

router.post('/admin/users', authRequired, adminOrUserManager, UserController.create);
router.get('/admin/users', authRequired, adminOrUserManager, UserController.list);
router.get('/admin/users/:id', authRequired, adminOrUserManager, UserController.getOne);
router.put('/admin/users/:id', authRequired, adminOrUserManager, UserController.update);

// Админ талаас нууц үг reset
router.post('/admin/users/:id/change-password', authRequired, adminOrUserManager, UserController.adminChangePassword);

// Статус/роль удирдлага
router.patch('/admin/users/:id/status', authRequired, adminOrUserManager, UserController.setStatus);
router.put('/admin/users/:id/roles', authRequired, adminOrUserManager, UserController.setRoles);

// Зөөлөн устгах / сэргээх
router.delete('/admin/users/:id', authRequired, adminOrUserManager, UserController.softDelete);
router.post('/admin/users/:id/restore', authRequired, adminOrUserManager, UserController.restore);

module.exports = router;
