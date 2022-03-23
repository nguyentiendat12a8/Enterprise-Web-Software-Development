const express = require('express');
const { dashboard } = require('../controllers/dashboard.controller');
const { verifyToken, isQA } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.get('/view-dashboard',[verifyToken, isQA], dashboard )

module.exports = router