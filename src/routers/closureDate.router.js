const express = require('express');
const { createClousureDate, listClosureDate, editClosureDate, updateClosureDate } = require('../controllers/closureDate.controller');
const {verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/create-closure-date',[verifyToken, isAdmin], createClousureDate)
router.get('/list-closure-date', [verifyToken, isAdmin],listClosureDate)
router.get('/edit-closure-date/:closureDateID', [verifyToken, isAdmin], editClosureDate)
router.post('/update-closure-date/:closureDateID', [verifyToken, isAdmin], updateClosureDate)

module.exports = router
