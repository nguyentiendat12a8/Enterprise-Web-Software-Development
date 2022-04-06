const db = require('../models/index')
const Ideas = db.ideas
const Department = db.department
const ClosureDate = db.closureDate
const Category = db.category

exports.dashboard = async (req, res) => {
    Promise.all([Ideas.find({ departmentID: '621dadf98ddbf30945ce2208' }), Ideas.find({ departmentID: '621dadf98ddbf30945ce220a' }),
    Ideas.find({ departmentID: '621dadf98ddbf30945ce2209' }), Ideas.countDocuments(), Department.countDocuments(), Category.countDocuments()])
        .then(([listIdeasIT, listIdeasGraphic, listIdeasBusiness, countIdeas, countDepartments, countCategories]) => {
            //IT
            var numberIdeasIT = 0
            var listIDIT = []
            listIdeasIT.forEach(async e => {
                // var year = e.createdAt
                // if (parseInt(year.getFullYear()) === 2022) {
                //     numberIdeasIT++
                // }
                listIDIT.push(e.accountID.toString())
                numberIdeasIT++
            })
            let UserITUnique = listIDIT.filter((v, i) => listIDIT.indexOf(v) === i)

            //graphic
            var numberIdeasGraphic = 0
            var listIDGraphic = []
            listIdeasGraphic.forEach(e => {
                listIDGraphic.push(e.accountID.toString())
                numberIdeasGraphic++
            })
            let UserGraphicUnique = listIDGraphic.filter((v, i) => listIDGraphic.indexOf(v) === i)

            //business
            var numberIdeasBusiness = 0
            var listIDBusiness = []
            listIdeasBusiness.forEach(e => {
                listIDBusiness.push(e.accountID.toString())
                numberIdeasBusiness++
            })
            let UserBusinessUnique = listIDBusiness.filter((v, i) => listIDBusiness.indexOf(v) === i)

            return res.status(200).send({
                errorCode: 0,
                numberIdeasIT,
                numberIdeasGraphic,
                numberIdeasBusiness,
                countUserIT: UserITUnique.length,
                countUserGraphic: UserGraphicUnique.length,
                countUserBusiness: UserBusinessUnique.length,
                countIdeas,
                countDepartments,
                countCategories
            })
        })
        .catch(error => {
            return res.status(500).send({
                errorCode: 500,
                message: 'Dashboard is error'
            })
        })
}
