
const db = require('../models/index')
const Account = db.account


checkDuplicateEmail = (req, res, next) => {
    Account.findOne({
        accountEmail: req.body.accountEmail
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({
                errorCode: 500,
                message: 'Account server is error!'
            })
            return
        }
        if (user) {
            res.status(400).send({
                errorCode: 400,
                message: 'Failed! Email is already in use'
            })
            return
        }
        next()
    })
}

// checkRolesExisted = (req, res, next) => {
//     if (req.body.roleID) {
//         //thu thay for = if (req.body.roles.length > 0)
//         //for(let i = 0; i < req.body.roles.length; i++){
//         if (!ROLES.includes(req.body.roleID)) {
//             res.status(400).send({
//                 message: `Failed! Role ${req.body.roleID} does not exist!`
//             })
//             return
//         }
//         //}
//     }
//     next()
// }

const verifySignUp =
{
    checkDuplicateEmail
}
module.exports = verifySignUp