const jwt = require('jsonwebtoken')
const config = process.env
const db = require('../models/index')
const User = db.user
const Role = db.role

exports.verifyToken = async (req, res, next) => {
    let token = req.body.token || req.query.token ||req.headers["x-access-token"];
    //const token = req.cookies.access_token
    //const token = req.body.access_token
    if(!token){
       return res.status(401).send("token is required!")
    }
    jwt.verify(token, config.TOKEN_KEY, (err,decoded)=>{
        if(err){
            if(err.name === 'JsonWebTokenError'){
                return res.status(401).send({message:'Unauthorized!'})
            }
            return res.status(401).send({message: err.message})
        }
        req.accountID = decoded.id
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
        return res.send({token : token})
    })
}

exports.isAdmin = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'admin') {
                        next()
                        return res.json(roles)
                    }
                }

                res.status(403).send({ message: 'Require admin role!' })
                return
            })

    })
}

exports.isQA = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'QA') {
                        next()
                        return
                    }
                }

                res.status(403).send({ message: 'Require QA role!' })
                return
            })

    })
}

exports.isQAOfIT = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'QA of IT') {
                        next()
                        return
                    }
                }

                res.status(403).send({ message: 'Require QA of IT role!' })
                return
            })

    })
}

exports.isQAOfBusiness = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'QA of business') {
                        next()
                        return
                    }
                }

                res.status(403).send({ message: 'Require QA of business role!' })
                return
            })

    })
}

exports.isQAOfGraphicDesign = (req, res, next) => {
    User.findById(req.userId).exec((err, user) => {
        if (err) {
            return res.status(500).send({ message: err })
        }

        Role.find({
            _id: { $in: user.roles }
        },
            (err, roles) => {
                if (err) {
                    res.status(500).send({ message: err })
                    return
                }

                for (let i = 0; i < roles.length; i++) {
                    if (roles[i].name === 'QA of graphic design') {
                        next()
                        return
                    }
                }

                res.status(403).send({ message: 'Require QA of graphic design role!' })
                return
            })

    })
}
