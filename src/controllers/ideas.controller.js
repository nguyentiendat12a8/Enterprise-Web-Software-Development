
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
var fs = require('fs')
const AdmZip = require('adm-zip')
const Joi = require("joi");

exports.createIdeas = async (req, res) => {
    try {
        // validate input
        const schema = Joi.object({
            departmentName: Joi.string(),
            categoryName: Joi.string(),
            anonymous: Joi.boolean(),
            ideasContent: Joi.string().trim().message("IdeasContent must exist"),
        });
        const { error } = schema.validate(req.body);
        if (error) return res.status(400).send({
            errorCode: 400,
            message: error.message
        });
        /////
        Promise.all([Department.findOne({ departmentName: req.body.departmentName }), Category.findOne({ categoryName: req.body.categoryName })])
            .then(async ([department, category]) => {
                const closureDate = await ClosureDate.findOne({ departmentID: department._id })
                const ideas = new Ideas({
                    ideasContent: req.body.ideasContent,
                    ideasFile: req.file.path,
                    closureDateID: closureDate._id,
                    accountID: req.accountID, 
                    departmentID: department._id,
                    categoryID: category._id,
                    anonymous: req.body.anonymous
                })

                await ideas.save(async (err, ideas) => {
                    if (err) res.status(500).send({
                        errorCode: 500,
                        message: err
                    })
                    //send mail to QAC
                    if (req.body.departmentName === 'IT') {
                        const user = await Account.findOne({ roleID: '621dadf98ddbf30945ce21fe' }) //role id of QA of IT
                        const email = user.accountEmail
                        const link = `localhost:1000/ideas/${ideas._id}`
                        await sendEmail(email, 'New ideas uploaded', link)
                    }
                    else if (req.body.departmentName === 'business') {
                        const user = await Account.findOne({ roleID: '621dadf98ddbf30945ce21ff' })//role id of QA of business
                        const email = user.accountEmail
                        const link = `localhost:1000/ideas/${ideas._id}`
                        await sendEmail(email, 'New ideas uploaded', link)
                    }
                    else {
                        const user = await Account.findOne({ roleID: '621dadf98ddbf30945ce2200' })//role id of QA of graphic design
                        const email = user.accountEmail
                        const link = `localhost:1000/ideas/${ideas._id}`
                        await sendEmail(email, 'New ideas uploaded', link)
                    }
                    res.status(200).send({
                        errorCode: 0,
                        message: 'add ideas successfuly'
                    })
                })
            })
    } catch (error) {
        console.log(error)
    }
}

exports.viewDetailIdeas = async (req, res) => {
    Promise.all([Comment.find({ ideasID: req.params.ideasID }), Ideas.findById(req.params.ideasID)])
        .then(async ([listComment, ideas]) => {
            var checkLike = false
            var checkDislike = false
            const department = await Department.findById(ideas.departmentID)
            const category = await Category.findById(ideas.categoryID)
            var check = await Like.findOne({ ideasID: req.params.ideasID, accountID: req.accountID })
            if (check) {
                if (check.like === true) {
                    checkLike = true
                } else {
                    checkDislike = true
                }
            }
            async function getComment(c) {
                if (c.anonymous === false) {
                    var user = await Account.findById(c.accountID)
                    var comment = {
                        author: user.accountEmail,
                        commentText: c.commentText,
                        createdAt: c.createdAt
                    }
                    showComment.push(comment)
                } else {
                    var comment = {
                        author: 'anonymous',
                        commentText: c.commentText,
                        createdAt: c.createdAt
                    }
                    showComment.push(comment)
                }
                return showComment
            }
            var showComment = []
            await Promise.all(listComment.map(c => getComment(c)))
            showComment.sort((a, b) => {
                return a.createdAt - b.createdAt
            })
            if (ideas.anonymous === false) {
                var user = await Account.findById(ideas.accountID)
                if (user === null) return res.status(500).send({
                    errorCode: 500,
                    message: 'User upload ideas have been deleted or the user server is down'
                })
                var ideasShow = {
                    name: user.accountEmail,
                    ideasContent: ideas.ideasContent,
                    ideasFile: ideas.ideasFile,
                    numberOfLike: ideas.numberOfLike,
                    numberOfDislike: ideas.numberOfDislike,
                    numberOfComment: ideas.numberOfComment,
                    numberOfView: ideas.numberOfView,
                    departmentName: department.departmentName,
                    categoryName: category.categoryName,
                }
            } else {
                var ideasShow = {
                    name: 'anonymous',
                    ideasContent: ideas.ideasContent,
                    ideasFile: ideas.ideasFile,
                    numberOfLike: ideas.numberOfLike,
                    numberOfDislike: ideas.numberOfDislike,
                    numberOfComment: ideas.numberOfComment,
                    numberOfView: ideas.numberOfView,
                    departmentName: department.departmentName,
                    categoryName: category.categoryName,
                }
            }
            return res.status(200).send({
                errorCode: 0,
                data: {
                    ideasShow,
                    showComment,
                    checkLike,
                    checkDislike
                }
            })
        })
        .catch((err) => {
            return res.status(500).send({
                errorCode: 500,
                data: 'sdfdsf'
            })
        })
}

exports.listIdeas = async (req, res) => {
    try {
        Ideas.find({}, async (err, list) => {
            if (err) return res.status(500).send({
                errorCode: 0,
                message: 'Ideas server is error'
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                // const departmentId = list[i].departmentID
                // var department = await Department.findById(departmentId)
                // if (department === null)
                //     return res.status(500).send({
                //         errorCode: 0,
                //         message: 'department server is error'
                //     })
                // const categoryId = list[i].categoryID
                // const category = await Category.findById(categoryId)
                // if (category == null) return res.status(500).send({
                //     errorCode: 0,
                //     message: 'category server is error'
                // })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    //ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    //departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow,
            })
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.myIdeas = async (req, res) => {
    Ideas.find({ accountID: req.accountID })
        .then(async ideas => {
            var listShow = []
            for (i = 0; i < ideas.length; i++) {
                // var department = await Department.findById({ _id: ideas[i].departmentID })
                // if (department === null)
                //     return res.status(500).send({
                //         errorCode: 0,
                //         message: 'department server is error'
                //     })
                // let category = await Category.findById({ _id: ideas[i].categoryID })
                // if (category == null) return res.status(500).send({
                //     errorCode: 0,
                //     message: 'category server is error'
                // })

                var listInfo = {
                    _id: ideas[i]._id,
                    ideasContent: ideas[i].ideasContent,
                    //ideasFile: list[i].ideasFile,
                    numberOfLike: ideas[i].numberOfLike,
                    numberOfDislike: ideas[i].numberOfDislike,
                    numberOfComment: ideas[i].numberOfComment,
                    numberOfView: ideas[i].numberOfView,
                    // departmentName: department.departmentName,
                    // categoryName: category.categoryName
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow,
            })
        })
        .catch(err => {
            if (err) return res.status(500).send({
                errorCode: 0,
                message: 'Ideas server is error'
            })
        })
}


exports.likeIdeas = async (req, res) => {
    try {
        const ideasID = req.params.ideasID
        const accountID = req.accountID

        const like = new Like({
            like: true,
            ideasID: ideasID,
            accountID: accountID
        })
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
    catch (err) {
        console.log(err)
    }
}

exports.dislikeIdeas = async (req, res) => {
    try {
        const ideasID = req.params.ideasID
        const accountID = req.accountID


        const dislike = new Like({
            dislike: true,
            ideasID: ideasID,
            accountID: accountID
        })

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
    }
    catch (err) {
        console.log(err)
    }
}

exports.commentIdeas = async (req, res) => {
    // validate input
    const schema = Joi.object({
        commentText: Joi.string().trim().error(new Error('comment text must exist')),
        anonymous: Joi.boolean().error(new Error('error anonymous')),
    });
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send({
        errorCode: 400,
        message: error.message
    });
    /////////////////
    const ideasID = req.params.ideasID
    const comment = new Comment({
        commentText: req.body.commentText,
        anonymous: req.body.anonymous,
        ideasID,
        accountID: req.accountID
    })
    await Promise.all([comment.save(), Ideas.findById(ideasID)])
        .then(async ([comment, ideas]) => {
            var user = await Account.findById(ideas.accountID)
            link = `localhost:1000/ideas/list-comment-ideas/${ideasID}`
            await sendEmail(user.accountEmail, 'Someone commented on your idea', link)
            const number = await Comment.countDocuments({ ideasID: ideasID })
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfComment: number }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'number of comment update successfully'
            })
        })
        .catch(err => {
            return res.status(500).send({
                errorCode: 500,
                message: err
            })
        })
}

exports.downloadIdeas = async (req, res) => {
    try {
        const d = new Date()
        const ideas = await Ideas.find()
        var listDown = []
        for (i = 0; i < ideas.length; i++) {
            var closureDate = await ClosureDate.findById(ideas[i].closureDateID)
            var date = await closureDate.finalClosureDate.split('/')
            if (parseInt(date[0]) < parseInt(d.getFullYear())) { 
                const { ideasContent, numberOfComment, numberOfLike, numberOfDislike, numberOfView } = ideas[i]
                listDown.push({ ideasContent, numberOfComment, numberOfLike, numberOfDislike, numberOfView })
            } else if (parseInt(date[0]) === parseInt(d.getFullYear())) {
                if (parseInt(date[1]) < (parseInt(d.getMonth()) + 1)) {
                    const { ideasContent, numberOfComment, numberOfLike, numberOfDislike, numberOfView } = ideas[i]
                    listDown.push({ ideasContent, numberOfComment, numberOfLike, numberOfDislike, numberOfView })
                } else if (parseInt(date[1]) === (parseInt(d.getMonth()) + 1)) {
                    if (parseInt(date[2]) < parseInt(d.getDate())) {
                        const { ideasContent, numberOfComment, numberOfLike, numberOfDislike, numberOfView } = ideas[i]
                        listDown.push({ ideasContent, numberOfComment, numberOfLike, numberOfDislike, numberOfView })
                    }
                }
            }
        }
        if (listDown.length === 0) {
            return res.status(400).send({
                errorCode: 400,
                message: 'No idea to download!'
            })
        }
        //const csvFields = ["Content", "Number of comment", "Number of like", "Number of dislike", "Number of view"];
        //const csvParser = new CsvParser({ csvFields })
        //const csvData = csvParser.parse(listDown)
        // res.setHeader("Content-Type", "text/csv")
        // res.setHeader("Content-Disposition", "attachment; filename=ideas.csv")
        // res.status(200).send(csvData)
        return res.status(200).send({
            errorCode: 0,
            data: listDown
        })
    }
    catch (err) {
        console.log(err)
    }
}

exports.downloadZip = (req, res) => {
    var uploadDir = fs.readdirSync(__dirname + "/../../uploads")
    const zip = new AdmZip()
    for (var i = 0; i < uploadDir.length; i++) {
        zip.addLocalFile(__dirname + "/../../uploads/" + uploadDir[i]);
    }
    //file name
    const downloadName = `Document.zip`

    const data = zip.toBuffer()
    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader('Content-Disposition', `attachment; filename=${downloadName}`);
    res.set('Content-Length', data.length);
    res.send(data);
}

exports.downloadFiles = (req, res) => {
    var filename = __dirname + `/../../uploads/${req.params.ideasFile}`
    res.download(filename)
}

//filter 

exports.filter = async (req, res) => {
    Ideas.find({}, async (err, list) => {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: err
        })
        const filter = req.query.filter
        if (filter === 'leastLike') {
            list.sort((a, b) => {
                return a.numberOfLike - b.numberOfLike
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })
                var id = list[i]._id
                var listInfo = {
                    _id: id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'mostLike') {
            list.sort((a, b) => {
                return b.numberOfLike - a.numberOfLike
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'mostComment') {
            list.sort((a, b) => {
                return b.numberOfComment - a.numberOfComment
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'leastComment') {
            list.sort((a, b) => {
                return a.numberOfComment - b.numberOfComment
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'mostView') {
            list.sort((a, b) => {
                return b.numberOfView - a.numberOfView
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'leastView') {
            list.sort((a, b) => {
                return a.numberOfView - b.numberOfView
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'leastDislike') {
            list.sort((a, b) => {
                return a.numberOfDislike - b.numberOfDislike
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        } else if (filter === 'mostDislike') {
            list.sort((a, b) => {
                return b.numberOfDislike - a.numberOfDislike
            })
            var listShow = []
            for (i = 0; i < list.length; i++) {
                const departmentId = list[i].departmentID
                var department = await Department.findById(departmentId)
                if (department === null)
                    return res.status(500).send({
                        errorCode: 0,
                        message: 'department server is error'
                    })

                var listInfo = {
                    _id: list[i]._id,
                    ideasContent: list[i].ideasContent,
                    ideasFile: list[i].ideasFile,
                    numberOfLike: list[i].numberOfLike,
                    numberOfDislike: list[i].numberOfDislike,
                    numberOfComment: list[i].numberOfComment,
                    numberOfView: list[i].numberOfView,
                    departmentName: department.departmentName,
                }
                listShow.push(listInfo)
            }
            return res.status(200).send({
                errorCode: 0,
                data: listShow
            })
        }
    })
}