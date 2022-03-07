
const db = require('../models/index')
const sendEmail = require('../utils/mailer')
const CsvParser = require('json2csv').Parser
const Ideas = db.ideas
const ClosureDate = db.closureDate
const Department = db.department
const Category = db.category
const Like = db.like
const Comment = db.comment
const Role = db.role
const Account = db.account

exports.createIdeas = async (req, res) => {
    const department = await Department.findOne({ departmentName: req.body.departmentName })
    //const category = Category.findOne({categoryName: req.body.categoryName})
    const closureDate = await ClosureDate.findOne({ departmentID: department._id })
    const ideas = new Ideas({
        ideasContent: req.body.ideasContent,
        ideasFile: req.file.path,
        numberOfLike: 0,
        numberOfDislike: 0,
        closureDateID: closureDate._id,
        accountID: req.body.accountID, // req.accountID,
        departmentID: department._id,
        //categoryID: category._id
    })
    // xử lý ngày để cho đăng ideas lên
    const d = new Date()
    const date = await closureDate.firstClosureDate.split('/')
    if (parseInt(date[0]) >  parseInt(d.getDate())) {
        ideas.save()
            .then(async () => {
                if (req.body.departmentName === 'IT') {
                    const role = await Role.findOne({ roleName: 'QA of IT' })
                    const user = await Account.findOne({ roleID: role._id })
                    const email = user.accountEmail
                    await sendEmail(email, 'New ideas uploaded', '')
                }
                else if (req.body.departmentName === 'business') {
                    const role = await Role.findOne({ roleName: 'QA of business' })
                    const user = await Account.findOne({ roleID: role._id })
                    const email = user.accountEmail
                    await sendEmail(email, 'New ideas uploaded', '')
                }
                else {
                    const role = await Role.findOne({ roleName: 'QA of graphic design' })
                    const user = await Account.findOne({ roleID: role._id })
                    const email = user.accountEmail
                    await sendEmail(email, 'New ideas uploaded', '')
                }

                res.status(200).send({
                    errorCode: 0,
                    message: 'add ideas successfuly'
                })
            }
            )
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


exports.listIdeas = async (req, res) => {
    Ideas.find({}, (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 0,
            message: 'Ideas server is error'
        })
        return res.status(200).send({
            errorCode: 0,
            data: list
        })
    })
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
        const d = new Date()
        const ideas = await Ideas.findById(ideasID)
        const closureDate = await ClosureDate.findById({ closureDateID: ideas.closureDateID })
        const finalDate = await closureDate.finalClosureDate.split('/')
        if (parseInt(finalDate[0]) < parseInt(d.getDate())) {
            await like.save()
            const number = await Like.find({ ideasID: ideasID })
            let sum = 0
            number.forEach(e => {
                if (e.like === true) {
                    sum = sum + 1
                }
            })
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfLike: sum }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'number of like update successfully'
            })
        }
        else {
            return res.status(401).send({
                errorCode: 401,
                message: 'Time like is expired'
            })
        }
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
        const d = new Date()
        const ideas = await Ideas.findById(ideasID)
        const closureDate = await ClosureDate.findById({ closureDateID: ideas.closureDateID })
        const finalDate = await closureDate.finalClosureDate.split('/')
        if (parseInt(finalDate[0]) < parseInt(d.getDate())) {
            await dislike.save()
            const number = await Like.find({ ideasID: ideasID })
            let sum = 0
            number.forEach(e => {
                if (e.dislike === true) {
                    sum = sum + 1
                }
            })
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike: sum }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'number of like update successfully'
            })
        } else {
            return res.status(401).send({
                errorCode: 0,
                message: 'Time dislike is expired!'
            })
        }

    }
    catch (err) {
        console.log(err)
    }
}

exports.commentIdeas = async (req, res) => {
    const ideasID = req.body.ideasID //params ?
    //const accountID = req.body.accountID // req.accountID

    const comment = new Comment({
        commentText,
        ideasID,
        accountID: req.userId
    })
    const d = new Date()
    const ideas = await Ideas.findById(ideasID)
    const closureDate = await ClosureDate.findById({ closureDateID: ideas.closureDateID })
    const finalDate = await closureDate.finalClosureDate.split('/')
    if (parseInt(finalDate[0]) < parseInt(d.getDate())) {
        await comment.save(err => {
            if (err) return res.status(500).send({
                errorCode: 0,
                message: 'Comment server is error'
            })
        })
        const number = await Comment.find({ ideasID: ideasID })
        let sum = 0
        number.forEach(e => {
            sum = sum + 1
        })
        await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfComment: sum }, { new: true })
        return res.status(200).send({
            errorCode: 0,
            message: 'number of comment update successfully'
        })
    }else {
        return res.status(401).send({
            errorCode: 0,
            message: 'Time comment is expired!'
        })
    }
}

exports.editCommentIdeas = (req, res) => {
    const ideasID = req.body.ideasID //params ?
    const accountID = req.body.accountID // req.accountID

}

exports.updateCommentIdeas = (req, res) => {

}

exports.deleteCommentIdeas = (req, res) => {

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