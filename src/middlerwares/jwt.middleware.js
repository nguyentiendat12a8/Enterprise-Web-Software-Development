const jwt = require('jsonwebtoken')
const config = process.env
const db = require('../models/index')
const Account = db.account
const Role = db.role

exports.verifyToken = async (req, res, next) => {
    let token = req.body.token || req.query.token || req.headers["x-access-token"];
    //const token = req.cookies.access_token
    //const token = req.body.access_token
    if (!token) {
        return res.status(401).send({
            errorCode: 401,
            message: 'token is required!'
        })
    }
    jwt.verify(token, config.TOKEN_KEY, (err, decoded) => {
        if (err) {
            if (err.name === 'JsonWebTokenError') {
                return res.status(401).send({ message: 'Unauthorized!' })
            }
            return res.status(401).send({ message: err.message })
        }
        req.accountID = decoded.id
        req.email = decoded.email
        //return res.send({token : token})
        next()
    })
}

exports.verifyRefreshToken = (req, res, next) => {
    let refreshToken = req.body.refreshToken || req.query.refreshToken
    //const refreshToken = req.cookies.access_token
    //const token = req.body.access_token
    if (!refreshToken) {
        return res.status(401).send("chua duoc dang nhap")
    }

    jwt.verify(refreshToken, config.REFRESH_TOKEN_KEY, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: 'Unauthorized!' })
        }
        const token = jwt.sign({ id: decoded.id }, config.TOKEN_KEY, {
            expiresIn: config.tokenLife
        })
        //req.userId = decoded.id
        //return res.json(token)
        return res.send({ token: token })
    })
}

exports.isAdmin = (req, res, next) => {
    Account.findById(req.accountID, (err, user) => {
        if (err) {
            return res.status(500).send({
                errorCode: 500,
                message: 'Account server is error!'
            })
        }
        Role.findById(user.roleID, (err, role) => {
            if (err) {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Role server is error!'
                })
            }
            if (role.roleName === 'admin') {
                return next()
            }
            return res.status(403).send({
                errorCode: 403,
                message: 'Require admin role!'
            })
        })
    })
}

exports.isQA = (req, res, next) => {
    Account.findById(req.accountID, (err, user) => {
        if (err) {
            return res.status(500).send({
                errorCode: 500,
                message: 'Account server is error!'
            })
        }
        Role.findById(user.roleID, (err, role) => {
            if (err) {
                return res.status(500).send({
                    errorCode: 500,
                    message: 'Role server is error!'
                })
            }
            if (role.roleName === 'QA') {
                return next()
            }
            return res.status(403).send({
                errorCode: 403,
                message: 'Require QA role!'
            })
        })
    })
}

exports.isQAOfIT = (req, res, next) => {
    Account.findById(req.accountID, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        Role.findById(user.roleID, (err, role) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            if (role.roleName === 'QA of IT') {
                return next()
            }
            return res.status(403).send({ message: 'Require QA of IT role!' })
        })
    })
}

exports.isQAOfBusiness = (req, res, next) => {
    Account.findById(req.accountID, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        Role.findById(user.roleID, (err, role) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            if (role.roleName === 'QA of business') {
                return next()
            }
            return res.status(403).send({ message: 'Require QA of business role!' })
        })
    })
}

exports.isQAOfGraphicDesign = (req, res, next) => {
    Account.findById(req.accountID, (err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }
        Role.findById(user.roleID, (err, role) => {
            if (err) {
                return res.status(500).send({ message: err })
            }
            if (role.roleName === 'QA of graphic design') {
                return next()
            }
            return res.status(403).send({ message: 'Require QA of graphic design role!' })
        })
    })
}
