const express = require('express');
const router = express.Router();
const authMiddleware = require('../utils/authMiddleware').authenticate;
const { analyzeMatrices } = require('../controllers/analysis.controller');

router.post('/analyze',authMiddleware, analyzeMatrices);

module.exports = router;