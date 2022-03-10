
const { array } = require('joi')
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
    if (!department) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Department server is error'
        })
    }
    const category = await Category.findOne({ categoryName: req.body.categoryName })
    if (!category) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Category server is error'
        })
    }
    const closureDate = await ClosureDate.findOne({ departmentID: department._id })
    if (!closureDate) {
        return res.status(500).send({
            errorCode: 500,
            message: 'Closure date server is error'
        })
    }
    const ideas = new Ideas({
        ideasContent: req.body.ideasContent,
        ideasFile: req.file.path,
        numberOfLike: 0,
        numberOfDislike: 0,
        closureDateID: closureDate._id,
        accountID: req.accountID, // req.accountID,
        departmentID: department._id,
        categoryID: category._id
    })
    // xử lý ngày để cho đăng ideas lên
    const d = new Date()
    const date = await closureDate.firstClosureDate.split('/')
    if (parseInt(date[0]) > parseInt(d.getDate())) {
        ideas.save(async (err, ideas) => {
            if (err) res.status(500).send({
                errorCode: 500,
                message: err
            })
            if (req.body.departmentName === 'IT') {
                const role = await Role.findOne({ roleName: 'QA of IT' })
                const user = await Account.findOne({ roleID: role._id })
                const email = user.accountEmail
                const link = `localhost:1000/ideas/${ideas._id}`
                await sendEmail(email, 'New ideas uploaded', link)
            }
            else if (req.body.departmentName === 'business') {
                const role = await Role.findOne({ roleName: 'QA of business' })
                const user = await Account.findOne({ roleID: role._id })
                const email = user.accountEmail
                const link = `localhost:1000/ideas/${ideas._id}`
                await sendEmail(email, 'New ideas uploaded', link)
            }
            else {
                const role = await Role.findOne({ roleName: 'QA of graphic design' })
                const user = await Account.findOne({ roleID: role._id })
                const email = user.accountEmail
                const link = `localhost:1000/ideas/${ideas._id}`
                await sendEmail(email, 'New ideas uploaded', link)
            }
            res.status(200).send({
                errorCode: 0,
                message: 'add ideas successfuly'
            })
        })
    }
    else {
        return res.status(401).send({
            errorCode: 401,
            message: 'over final closure date!'
        })
    }
}

exports.viewSubmitIdeas = async (req, res) => {
    Ideas.findById(req.params.ideasID, async (err, ideas) => {
        if (err) return res.status(500).send({
            errorCode: 0,
            message: err
        })
        var department = await Department.findById(ideas.departmentID)
        if (!department) {
            return res.status(500).send({
                errorCode: 500,
                message: 'Department server is error'
            })
        }
        var category = await Category.findById(ideas.categoryID)
        if (!category) {
            return res.status(500).send({
                errorCode: 500,
                message: 'Category server is error'
            })
        }
        var ideasShow = {
            ideasContent: ideas.ideasContent,
            ideasFile: ideas.ideasFile,
            numberOfLike: ideas.numberOfLike,
            numberOfDislike: ideas.numberOfDislike,
            numberOfComment: ideas.numberOfComment,
            departmentName: department.departmentName,
            categoryName: category.categoryName
        }
        return res.status(200).send({
            errorCode: 0,
            data: ideasShow
        })
    })
}

exports.listIdeas = async (req, res) => {
    try {
        let perPage = 5
        let page = req.params.page || 1
        Ideas.find({})
            .skip((perPage * page) - perPage)
            .limit(perPage)
            .exec(async (err, list) => {
                if (err) return res.status(500).send({
                    errorCode: 0,
                    message: 'Ideas server is error'
                })
                var listShow = []
                for (i = 0; i < list.length; i++) {
                    var department = await Department.findById({ _id: list[i].departmentID })
                    if (!department)
                        return res.status(500).send({
                            errorCode: 0,
                            message: 'department server is error'
                        })
                    let category = await Category.findById({ _id: list[i].categoryID })
                    if (!category) return res.status(500).send({
                        errorCode: 0,
                        message: 'category server is error'
                    })

                    var listInfo = {
                        _id: list[i]._id,
                        ideasContent: list[i].ideasContent,
                        ideasFile: list[i].ideasFile,
                        numberOfLike: list[i].numberOfLike,
                        numberOfDislike: list[i].numberOfDislike,
                        numberOfComment: list[i].numberOfComment,
                        departmentName: department.departmentName,
                        categoryName: category.categoryName
                    }
                    listShow.push(listInfo)
                }
                Ideas.countDocuments((err, count) => {
                    return res.status(200).send({
                        errorCode: 0,
                        data: listShow,
                        current: page,
                        pages: Math.ceil(count / perPage)
                    })
                })
            })
    }
    catch (err) {
        console.log(err)
    }

}


exports.likeIdeas = async (req, res) => {
    try {
        const ideasID = req.params.ideasID //params ?
        const accountID = req.accountID // req.accountID

        const like = new Like({
            like: true,
            //dislike: false,
            ideasID: ideasID,
            accountID: accountID
        })
        const d = new Date()
        const ideas = await Ideas.findById({ _id: ideasID })
        const closureDate = await ClosureDate.findById({ _id: ideas.closureDateID })
        const finalDate = await closureDate.finalClosureDate.split('/')
        if (parseInt(finalDate[0]) > parseInt(d.getDate())) {
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
        const ideasID = req.params.ideasID //params ?
        const accountID = req.accountID // req.accountID

        const dislike = new Like({
            dislike: true,
            ideasID: ideasID,
            accountID: accountID
        })
        const d = new Date()
        const ideas = await Ideas.findById({ _id: ideasID })
        const closureDate = await ClosureDate.findById({ _id: ideas.closureDateID })
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
                message: 'number of dislike update successfully'
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
    const ideasID = req.params.ideasID //params ?
    //const accountID = req.body.accountID // req.accountID

    const comment = new Comment({
        commentText: req.body.commentText,
        ideasID,
        accountID: req.accountID
    })
    const d = new Date()
    const ideas = await Ideas.findById(ideasID)
    const closureDate = await ClosureDate.findById(ideas.closureDateID)
    const finalDate = await closureDate.finalClosureDate.split('/')
    if (parseInt(finalDate[0]) > parseInt(d.getDate())) {
        await comment.save((err, comment) => {
            if (err) return res.status(500).send({
                errorCode: 0,
                message: 'Comment server is error'
            })
        })
        const user = await Account.findById(req.accountID)
        if (!user) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        link = `localhost:1000/ideas/list-comment-ideas/${ideasID}`
        await sendEmail(user.accountEmail, 'Someone commented on your idea', link)
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
    } else {
        return res.status(401).send({
            errorCode: 0,
            message: 'Time comment is expired!'
        })
    }
}

exports.listCommentIdeas = (req, res) => {
    const ideasID = req.params.ideasID
    Comment.find({ ideasID }, (err, listComment) => {
        if (err) {
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        }
        return res.status(200).send({
            errorCode: 0,
            data: listComment
        })
    })
}

exports.editCommentIdeas = (req, res) => {
    const ideasID = req.body.ideasID //params ?
    const accountID = req.body.accountID // req.accountID

}

exports.updateCommentIdeas = (req, res) => {

}

exports.deleteCommentIdeas = async (req, res) => {
    const comment = await Comment.findById('622a10e1f965150f29d40efa')
    if (!comment) return res.status(500).send({
        errorCode: 500,
        message: 'Comment server is error'
    })
    await comment.delete()
    return res.status(200).send({
        errorCode: 0,
        message: 'Comment delete successfully'
    })
}

exports.downloadIdeas = (req, res) => {
    Ideas.find().then((objs) => {
        let ideas = []
        objs.forEach((obj) => {
            const { _id, ideasContent } = obj
            ideas.push({ _id, ideasContent })
        })
        const csvFields = ["Id", "ideasContent"];
        const csvParser = new CsvParser({ csvFields })
        const csvData = csvParser.parse(ideas)
        res.setHeader("Content-Type", "text/csv")
        res.setHeader("Content-Disposition", "attachment; filename=ideas.csv")
        res.status(200).send(csvData)
    })
        .catch(err => {
            console.log(err)
        })
}