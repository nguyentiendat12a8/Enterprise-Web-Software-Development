const express = require('express');
const { createIdeas, likeIdeas, dislikeIdeas, commentIdeas } = require('../controllers/ideas.controller');
const { checkLike, checkDislike } = require('../middlerwares/checkLike.middleware');
const { verifyToken } = require('../middlerwares/jwt.middleware');
const { upload } = require('../utils/uploadFile')

const router = express.Router();

router.post('/uploadIdeas',[verifyToken,upload.single('ideasFile')] ,createIdeas)
router.post('/likeIdeas/:ideasID',[verifyToken,checkLike], likeIdeas)
router.post('/dislikeIdeas/:ideasID',[verifyToken,checkDislike], dislikeIdeas)
router.post('/commentIdeas/:ideasID',[verifyToken], commentIdeas)

module.exports = router
