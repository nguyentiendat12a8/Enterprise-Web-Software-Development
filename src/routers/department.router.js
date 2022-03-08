const express = require('express');
const { listDepartment } = require('../controllers/department.controller');
const router = express.Router();

router.get('/listDepartment', [verifyToken], listDepartment )

module.exports = router