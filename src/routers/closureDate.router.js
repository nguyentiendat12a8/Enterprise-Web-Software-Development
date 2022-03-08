const express = require('express');
const { createClousureDate } = require('../controllers/closureDate.controller');
const {verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/createClosureDate',[verifyToken, isAdmin], createClousureDate)

module.exports = router
