const db = require('../models/index')
const ClosureDate = db.closureDate
const Department = db.department

exports.createClousureDate = async  (req,res) =>{
    try{
        const department = await Department.findOne({departmentName: req.body.departmentName})
        const closureDate = new ClosureDate({
            firstClosureDate: req.body.firstClosureDate,
            finalClosureDate: req.body.finalClosureDate,
            departmentID: department._id
        })
        closureDate.save(err =>{
            if(err) return res.status(500).send({
                errorCode: '500',
                message: 'add closure date fail!'
            })
            return res.status(200).send({
                errorCode: 0,
                message: 'add closure date successfully!'
            })
        })
    }
    catch(err) {
        console.log(err)
    }
}
