const express = require('express');
const { signup, signin } = require('../controllers/account.controller');
const jwt = require('../middlerwares/jwt.middleware');
const uploadAvatar = require('../middlerwares/uploadFile.middleware');
const verifySignUp = require('../middlerwares/verifySignUp.middleware');
const router = express.Router();


router.post('/signup',[verifySignUp.checkDuplicateUsernameOrEmail,verifySignUp.checkRolesExisted , uploadAvatar.single('avatar')], signup)
router.post('/signin',[jwt.verifyToken], signin)

module.exports = router
