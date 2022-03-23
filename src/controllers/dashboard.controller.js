const db = require('../models/index')
const Ideas = db.ideas
const Department = db.department
const Account = db.account

exports.dashboard = async (req, res) => {
    try {
        var IT = await Department.findOne({ departmentName: 'IT' })
        var graphic = await Department.findOne({ departmentName: 'graphic design' })
        var business = await Department.findOne({ departmentName: 'business' })
        //Count ideas for each department
        const numberIdeasIT = await Ideas.countDocuments({ departmentID: IT._id })
        const numberIdeasGraphic = await Ideas.countDocuments({ departmentID: graphic._id })
        const numberIdeasBusiness = await Ideas.countDocuments({ departmentID: business._id })
        //count user submit ideas in each department
        
        //business
        const listIdeasIT = await Ideas.find({ departmentID: IT._id })
        
        if (!listIdeasIT) return res.status(500).send({
            errorCode: 500,
            message: 'ideas server is error'
        })
        var listUserBusiness = []
        listIdeasIT.forEach(e=>{
            listUserBusiness.push(e.accountID.toString())
        })
        let x = listUserBusiness.filter((v,i) => listUserBusiness.indexOf(v) === i)
        
        return res.status(200).send({
            errorCode: 0,
            numberIdeasIT,
            numberIdeasGraphic,
            numberIdeasBusiness,
            countUserIT : x.length
            //countUserGraphic: listUserGraphicUnique.length,
            //countUserBusiness : listUserBusinessUnique.length,
        })
    } catch (error) {
        // return res.status(500).send({
        //     errorCode: 500,
        //     message: error
        // })
        console.log(error)
    }


}
