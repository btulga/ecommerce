// src/routes/user-auth-routes.js
const express = require('express');
const UserAuthController = require('../controllers/user-auth.controller');
const { authRequired } = require('../middlewares/auth.middleware');

const router = express.Router();

// Public
router.post('/auth/login', UserAuthController.login);

// Protected (JWT)
router.get('/auth/me', authRequired, UserAuthController.me);

module.exports = router;
