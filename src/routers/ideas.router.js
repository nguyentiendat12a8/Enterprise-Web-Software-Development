const express = require('express');
const { createIdeas, likeIdeas, dislikeIdeas, commentIdeas, listCommentIdeas, listIdeas, viewSubmitIdeas } = require('../controllers/ideas.controller');
const { checkLike, checkDislike } = require('../middlerwares/checkLike.middleware');
const { verifyToken } = require('../middlerwares/jwt.middleware');
const { upload } = require('../utils/uploadFile')

const router = express.Router();

router.post('/upload-ideas',[verifyToken,upload.single('ideasFile')] ,createIdeas)
router.post('/like-ideas/:ideasID',[verifyToken,checkLike], likeIdeas)
router.post('/dislike-ideas/:ideasID',[verifyToken,checkDislike], dislikeIdeas)
router.post('/comment-ideas/:ideasID',[verifyToken], commentIdeas)
router.get('/list-comment-ideas/:ideasID',[verifyToken], listCommentIdeas)
router.get('/list-ideas',[verifyToken], listIdeas)

router.get('/view-submit-ideas/:ideasID', [verifyToken], viewSubmitIdeas)

module.exports = router
