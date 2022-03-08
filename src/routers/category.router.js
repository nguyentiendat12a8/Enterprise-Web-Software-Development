const express = require('express');
const { createCategory, deleteCategory, ListCategory } = require('../controllers/category.controller');
const { verifyToken, isQA } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/createCategory', [verifyToken, isQA], createCategory )
router.delete('/deleteCategory', [verifyToken, isQA], deleteCategory )
router.get('/listCategory/:departmentID', [verifyToken, isQA], ListCategory )

module.exports = router