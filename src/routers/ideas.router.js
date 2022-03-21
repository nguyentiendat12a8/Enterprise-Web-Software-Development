const express = require('express');
const { createIdeas, likeIdeas, dislikeIdeas, commentIdeas, listCommentIdeas, listIdeas,
    viewSubmitIdeas, downloadIdeas, deleteCommentIdeas, filterMostLike, filterLeastLike,
    filterMostComment, filterLeastComment } = require('../controllers/ideas.controller');
const { checkClosureDate } = require('../middlerwares/checkClosureDate.middleware');
const { checkLike, checkDislike } = require('../middlerwares/checkLike.middleware');
const { verifyToken, isQA } = require('../middlerwares/jwt.middleware');
const { upload } = require('../utils/uploadFile')

const router = express.Router();

router.post('/upload-ideas', [verifyToken, upload.single('ideasFile')], createIdeas)
router.post('/like-ideas/:ideasID', [verifyToken, checkClosureDate, checkLike], likeIdeas)
router.post('/dislike-ideas/:ideasID', [verifyToken, checkClosureDate, checkDislike], dislikeIdeas)
router.post('/comment-ideas/:ideasID', [verifyToken, checkClosureDate], commentIdeas)
router.post('/delete-comment/:commnetID', deleteCommentIdeas)

router.get('/list-comment-ideas/:ideasID', [verifyToken], listCommentIdeas)
router.get('/list-ideas/:page', [verifyToken], listIdeas)

router.get('/view-submit-ideas/:ideasID', [verifyToken], viewSubmitIdeas)

router.get('/download-ideas', [verifyToken, isQA], downloadIdeas)

//filter
router.get('/filter-most-like', [verifyToken], filterMostLike)
router.get('/filter-least-like', [verifyToken], filterLeastLike)
router.get('/filter-most-comment', [verifyToken], filterMostComment)
router.get('/filter-least-comment', [verifyToken], filterLeastComment)

module.exports = router
