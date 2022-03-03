
const db = require('../models/index')
const CsvParser = require('json2csv').Parser
const Ideas = db.ideas
const ClosureDate = db.closureDate
const Department = db.department
const Category = db.category
const Like = db.like

exports.createIdeas = async (req, res) => {
    const department = await Department.findOne({ departmentName: req.body.departmentName })
    //const category = Category.findOne({categoryName: req.body.categoryName})
    const closureDate = await ClosureDate.findOne({ departmentID: department._id })
    const ideas = new Ideas({
        ideasContent: req.body.ideasContent,
        ideasFile: req.body.ideasFile,
        numberOfLike: 0,
        numberOfDislike: 0,
        closureDateID: closureDate._id,
        accountID: req.accountID,
        departmentID: department._id,
        //categoryID: category._id
    })
    // xử lý ngày để cho đăng ideas lên
    const d = new Date()
    const date = await closureDate.firstClosureDate.split('/')
    if (parseInt(date[0]) < parseInt(d.getDate())) {
        ideas.save()
            .then(() => res.status(200).send({
                errorCode: 0,
                message: 'add ideas successfuly'
            }))
            .catch(err => {
                console.log(err)
            })
    }
    else {
        return res.status(401).send({
            errorCode: 401,
            message: 'over final closure date!'
        })
    }
}

exports.likeIdeas = async (req, res) => {
    try {
        const ideasID = req.body.ideasID //params ?
        const accountID = req.body.accountID // req.accountID

        const like = new Like({
            like: true,
            //dislike: false,
            ideasID: ideasID,
            accountID: accountID
        })
        await like.save()
        const number = await Like.find({ideasID : ideasID})
        let sum = 0
        number.forEach(e =>{
            if(e.ike === true){
                sum = sum+1
            }
        })
        await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfLike: sum }, { new: true })
        return res.status(200).send({
            errorCode: 0,
            message: 'number of like update successfully'
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.dislikeIdeas = async (req, res) => {
    try {
        const ideasID = req.body.ideasID //params ?
        const accountID = req.body.accountID // req.accountID

        const dislike = new Like({
            dislike: true,
            ideasID: ideasID,
            accountID: accountID
        })
        await dislike.save()
        const number = await Like.find({ideasID : ideasID})
        let sum = 0
        number.forEach(e =>{
            if(e.dislike === true){
                sum = sum+1
            }
        })
        await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike: sum }, { new: true })
        return res.status(200).send({
            errorCode: 0,
            message: 'number of like update successfully'
        })
    }
    catch (err) {
        console.log(err)
    }
}



exports.downloadIdeas = (req, res) => {
    Ideas.findAll().then((objs) => {
        let ideas = []
        objs.forEach((obj) => {
            const { _id, ideasContent } = obj
            ideas.push({ _id, ideasContent })
        })
        const csvFields = ["Id", "ideasContent"];
        const csvParser = new CsvParser({ csvFields })
        const csvData = csvParser.parse(tutorials)
        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=ideas.csv")
        res.status(200).end(csvData)
    })
        .catch(err => {
            console.log(err)
        })
}