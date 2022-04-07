const db = require('../models/index')
const Ideas = db.ideas
const ClosureDate = db.closureDate
const Department = db.department

exports.checkFinalClosureDate = async (req,res,next) => {
    try {
        const d = new Date()
        const ideas = await Ideas.findById(req.params.ideasID)
        const closureDate = await ClosureDate.findById(ideas.closureDateID)
        const date = closureDate.finalClosureDate.split('-') 
        if (parseInt(date[0]) > parseInt(d.getFullYear())) {
            next()
        } else if (parseInt(date[0]) === parseInt(d.getFullYear())) {
            if (parseInt(date[1]) > (parseInt(d.getMonth()) + 1)) {
                next()
            } else if (parseInt(date[1]) === (parseInt(d.getMonth()) + 1)) {
                if (parseInt(date[2]) > parseInt(d.getDate())) {
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
        const department = await Department.findOne({departmentName: req.body.departmentName})
        if(department === null) return res.status(500).send({
            errorCode: 500,
            message: 'department error'
        })
        const closureDate = await ClosureDate.findOne({departmentID: department._id})
        const date = closureDate.firstClosureDate.split('-') 

        if (parseInt(date[0]) > parseInt(d.getFullYear())) {
            next()
        } else if (parseInt(date[0]) === parseInt(d.getFullYear())) {
            if (parseInt(date[1]) > (parseInt(d.getMonth()) + 1)) {
                next()
            } else if (parseInt(date[1]) === (parseInt(d.getMonth()) + 1)) {
                if (parseInt(date[2]) > parseInt(d.getDate())) {
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


exports.checkAddClosureDate = async (req,res,next) => {
    const department = await Department.findOne({departmentName: req.body.departmentName})
    if (!department) return res.status(400).send({
        errorCode: 400,
        message: 'You must be select department name!'
    })
    const check = await ClosureDate.findOne({departmentID: department._id})
    if (check) return res.status(400).send({
        errorCode: 400,
        message: 'Each department has only 1 timeline!'
    })
    next()
}


