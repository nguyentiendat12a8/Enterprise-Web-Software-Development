const express = require('express');
const { createIdeas, likeIdeas, dislikeIdeas } = require('../controllers/ideas.controller');
const { checkLike, checkDislike } = require('../middlerwares/checkLike.middleware');

const router = express.Router();

router.post('/createIdeas', createIdeas)
router.post('/likeIdeas',[checkLike], likeIdeas)
router.post('/dislikeIdeas',[checkDislike], dislikeIdeas)

module.exports = router
