
const db = require('../models/index')
const Account = db.account
const ROLES = db.ROLES

checkDuplicateEmail = (req, res, next) => {
    Account.findOne({
        accountEmail: req.body.accountEmail
    }).exec((err, user) => {
        if (err) {
            res.status(500).send({ message: err })
            return
        }
        if (user) {
            res.status(400).send({ message: 'Failed! Email is already in use' })
            return
        }
        next()
    })
}

checkRolesExisted = (req, res, next) => {
    if (req.body.roles) {
        //thu thay for = if (req.body.roles.length > 0)
        //for(let i = 0; i < req.body.roles.length; i++){
        if (!ROLES.includes(req.body.roles)) {
            res.status(400).send({
                message: `Failed! Role ${req.body.roles} does not exist!`
            })
            return
        }
        //}
    }
    next()
}

const verifySignUp = 
{
    checkDuplicateEmail,
    checkRolesExisted
}
module.exports = verifySignUp