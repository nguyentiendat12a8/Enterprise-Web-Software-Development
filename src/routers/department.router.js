const express = require('express');
const { listDepartment } = require('../controllers/department.controller');
const { verifyToken } = require('../middlerwares/jwt.middleware');
const router = express.Router();

router.get('/list-department',[verifyToken], listDepartment )

module.exports = router