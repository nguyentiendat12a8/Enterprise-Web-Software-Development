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
        const listIdeasIT = await Ideas.find({ departmentID: IT._id })
        if (!listIdeasIT) return res.status(500).send({
            errorCode: 500,
            message: 'ideas server is error'
        })
        var listUserIT =[]
        listIdeasIT.forEach(e => {
            listUserIT.push(e.accountID)
        })

//         var newArr = []
//   for (var i = 0; i < listUserIT.length; i++) {
//     if (newArr.indexOf(listUserIT[i]) === -1) {
//       newArr.push(listUserIT[i])
//     }
//   }

        //var listUserIT =listIdeasIT.map(e=> e = e.accountID)

        //const listUserITUnique = Array.from(new Set(listUserIT))
        console.log(newArr)
        //graphic
        const listIdeasGraphic = await Ideas.find({ departmentID: graphic._id })
        if (!listIdeasGraphic) return res.status(500).send({
            errorCode: 500,
            message: 'ideas server is error'
        })
        var listUserGraphic = []
        listIdeasGraphic.forEach(e => {
            listUserGraphic.push(e.accountID)
        })
        const listUserGraphicUnique = Array.from(new Set(listUserGraphic))
        
        //business
        const listIdeasBusiness = await Ideas.find({ departmentID: business._id })
        if (!listIdeasBusiness) return res.status(500).send({
            errorCode: 500,
            message: 'ideas server is error'
        })
        var listUserBusiness = []
        listIdeasBusiness.forEach(e => {
            listUserBusiness.push(e.accountID)
        })
        const listUserBusinessUnique = Array.from(new Set(listUserBusiness))
        
        return res.status(200).send({
            errorCode: 0,
            numberIdeasIT,
            numberIdeasGraphic,
            numberIdeasBusiness,
            //countUserIT : unique,
            countUserGraphic: listUserGraphicUnique.length,
            countUserBusiness : listUserBusinessUnique.length,
        })
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: error
        })
    }


}
