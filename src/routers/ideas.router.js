const express = require('express');
const { createIdeas } = require('../controllers/ideas.controller');

const router = express.Router();

router.post('/createIdeas', createIdeas)

module.exports = router
