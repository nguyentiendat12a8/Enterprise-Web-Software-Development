const express = require('express');
const { createClousureDate, listClosureDate } = require('../controllers/closureDate.controller');
const {verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/create-closure-date',[verifyToken, isAdmin], createClousureDate)
router.get('/list-closure-date', [verifyToken, isAdmin],listClosureDate)

module.exports = router
