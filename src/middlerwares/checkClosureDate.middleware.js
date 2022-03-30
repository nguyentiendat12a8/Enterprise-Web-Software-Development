const db = require('../models/index')
const Ideas = db.ideas
const ClosureDate = db.closureDate

exports.checkFinalClosureDate = async (req,res,next) => {
    try {
        const d = new Date()
        const ideas = await Ideas.findById(req.params.ideasID)
        const closureDate = await ClosureDate.findById(ideas.closureDateID)
        const date = closureDate.finalClosureDate.split('/') //await closureDate.finalClosureDate.split('/')

        if (parseInt(date[2]) > parseInt(d.getFullYear())) {
            next()
        } else if (parseInt(date[2]) === parseInt(d.getFullYear())) {
            if (parseInt(date[1]) > (parseInt(d.getMonth()) + 1)) {
                next()
            } else if (parseInt(date[1]) === (parseInt(d.getMonth()) + 1)) {
                if (parseInt(date[0]) > parseInt(d.getDate())) {
                    next()
                } else {
                    return res.status(401).send({
                        errorCode: 401,
                        message: 'Time is expired!'
                    })
                }
            } else {
                return res.status(401).send({
                    errorCode: 401,
                    message: 'Time is expired!'
                })
            }
        } else {
            return res.status(401).send({
                errorCode: 401,
                message: 'Time is expired!'
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}


exports.checkFirstClosureDate = async (req,res,next) => {
    try {
        const d = new Date()
        const ideas = await Ideas.findById(req.params.ideasID)
        const closureDate = await ClosureDate.findById(ideas.closureDateID)
        const date = closureDate.firstClosureDate.split('/') //await closureDate.finalClosureDate.split('/')

        if (parseInt(date[2]) > parseInt(d.getFullYear())) {
            next()
        } else if (parseInt(date[2]) === parseInt(d.getFullYear())) {
            if (parseInt(date[1]) > (parseInt(d.getMonth()) + 1)) {
                next()
            } else if (parseInt(date[1]) === (parseInt(d.getMonth()) + 1)) {
                if (parseInt(date[0]) > parseInt(d.getDate())) {
                    next()
                } else {
                    return res.status(401).send({
                        errorCode: 401,
                        message: 'Time is expired!'
                    })
                }
            } else {
                return res.status(401).send({
                    errorCode: 401,
                    message: 'Time is expired!'
                })
            }
        } else {
            return res.status(401).send({
                errorCode: 401,
                message: 'Time is expired!'
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}





