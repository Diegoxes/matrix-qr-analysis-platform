// src/routes/qr.routes.js
const express = require('express');
const router = express.Router();
const { calcularQR } = require('../controllers/qr.controller');
const authMiddleware=require('../utils/authMiddleware').authenticate

router.post('/factorizar',authMiddleware, calcularQR);

module.exports = router;