const express = require('express');
const { listDepartment } = require('../controllers/department.controller');
const router = express.Router();

router.get('/list-department', listDepartment )

module.exports = router