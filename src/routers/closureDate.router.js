const express = require('express');
const { createClousureDate, listClosureDate, editClosureDate, updateClosureDate } = require('../controllers/closureDate.controller');
const { checkAddClosureDate } = require('../middlerwares/checkClosureDate.middleware');
const {verifyToken, isAdmin } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/create-closure-date',[verifyToken, isAdmin, checkAddClosureDate], createClousureDate)
router.get('/list-closure-date', [verifyToken, isAdmin],listClosureDate)
router.get('/edit-closure-date/:closureDateID', [verifyToken, isAdmin], editClosureDate)
router.put('/update-closure-date/:closureDateID', [verifyToken, isAdmin], updateClosureDate)

module.exports = router
