const express = require('express');
const { createClousureDate } = require('../controllers/closureDate.controller');




const router = express.Router();

router.post('/createClosureDate', createClousureDate)

module.exports = router
