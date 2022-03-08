const express = require('express');
const { createIdeas, likeIdeas, dislikeIdeas, commentIdeas, listCommentIdeas } = require('../controllers/ideas.controller');
const { checkLike, checkDislike } = require('../middlerwares/checkLike.middleware');
const { verifyToken } = require('../middlerwares/jwt.middleware');
const { upload } = require('../utils/uploadFile')

const router = express.Router();

router.post('/upload-ideas',[verifyToken,upload.single('ideasFile')] ,createIdeas)
router.post('/like-ideas/:ideasID',[verifyToken,checkLike], likeIdeas)
router.post('/dislike-ideas/:ideasID',[verifyToken,checkDislike], dislikeIdeas)
router.post('/comment-ideas/:ideasID',[verifyToken], commentIdeas)
router.get('/list-comment-ideas/:ideasID',[verifyToken], listCommentIdeas)

module.exports = router
