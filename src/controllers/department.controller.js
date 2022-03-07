const db = require('../models/index')
const Department = db.department

exports.getDepartment = (req, res) =>{
    Department.find({}, (err, department) =>{
        if(err) {
            return res.status(500).send({
                errorCode : '500',
                message: 'Department server is error -.-'
            })
        }
        res.status(200).send({
            errorCode: 0,
            data: department
        })
    })
}