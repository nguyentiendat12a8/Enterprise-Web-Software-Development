const express = require('express');
const { createCategory, deleteCategory, ListCategory } = require('../controllers/category.controller');
const { verifyToken, isQA } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.post('/create-category', createCategory )
router.delete('/delete-category/:categoryID', [verifyToken, isQA], deleteCategory )
router.get('/list-category', [verifyToken], ListCategory )

module.exports = router