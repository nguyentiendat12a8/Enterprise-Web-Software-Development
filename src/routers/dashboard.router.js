const express = require('express');
const { dashboard } = require('../controllers/dashboard.controller');
const router = express.Router();

router.get('/view-dashboard', dashboard )

module.exports = router