const express = require('express');
const { createClousureDate } = require('../controllers/closureDate.controller');
const {verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/create-closure-date',[verifyToken, isAdmin], createClousureDate)

module.exports = router
