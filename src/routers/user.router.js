const express = require('express');
const { signup, signin } = require('../controllers/account.controller');
const uploadAvatar = require('../middlerwares/uploadFile.middleware');
const verifySignUp = require('../middlerwares/verifySignUp.middleware');
const router = express.Router();


router.post('/signup',[verifySignUp.checkDuplicateEmail,verifySignUp.checkRolesExisted , uploadAvatar.single('avatar')], signup)
router.post('/signin', signin)

module.exports = router
