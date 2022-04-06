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
        //const d = new Date()
        const department = await Department.findOne({departmentName: req.body.departmentName})
        if(department === null) return res.status(500).send({
            errorCode: 500,
            message: 'department error'
        })
        const closureDate = await ClosureDate.findOne({departmentID: department._id})
        if(new Date(closureDate.firstClosureDate) < new Date()){
            return res.status(400).send({
                errorCode: 400,
                message: 'Time is expired!'
            })
        }
        next()






        // const date = closureDate.firstClosureDate.split('-') //await closureDate.finalClosureDate.split('/')

        // if (parseInt(date[2]) > parseInt(d.getFullYear())) {
        //     next()
        // } else if (parseInt(date[2]) === parseInt(d.getFullYear())) {
        //     if (parseInt(date[1]) > (parseInt(d.getMonth()) + 1)) {
        //         next()
        //     } else if (parseInt(date[1]) === (parseInt(d.getMonth()) + 1)) {
        //         if (parseInt(date[0]) > parseInt(d.getDate())) {
        //             next()
        //         } else {
        //             return res.status(401).send({
        //                 errorCode: 401,
        //                 message: 'Time is expired!'
        //             })
        //         }
        //     } else {
        //         return res.status(401).send({
        //             errorCode: 401,
        //             message: 'Time is expired!'
        //         })
        //     }
        // } else {
        //     return res.status(401).send({
        //         errorCode: 401,
        //         message: 'Time is expired!'
        //     })
        // }
    }
    catch (err) {
        console.log(err)
    }
}


// exports.checkDownload = async (req,res,next) => {
//     try {
//         const d = new Date()
//         var closureDate = await ClosureDate.findById(e.closureDateID)
//             var date = closureDate.finalClosureDate.split('/')

        
//     }
//     catch (err) {
//         console.log(err)
//     }
// }


