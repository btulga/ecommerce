const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const userRoutes = require('/workspace/ecommerce-headless-rest-api/src/routes/userRoutes');

router.use('/users', userRoutes);

module.exports = router;