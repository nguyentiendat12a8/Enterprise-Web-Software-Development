const db = require('../models/index')
const Ideas = db.ideas
const ClosureDate = db.closureDate

exports.checkClosureDate = async (req,res,next) => {
    try {
        const ideasID = req.params.ideasID
        const d = new Date()
        const ideas = await Ideas.findById(ideasID)
        const closureDate = await ClosureDate.findById(ideas.closureDateID)
        const date = await closureDate.finalClosureDate.split('/')

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






