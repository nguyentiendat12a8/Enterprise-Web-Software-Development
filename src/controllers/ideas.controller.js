
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

        const tim = await Like.findOne({
            accountID: accountID,
            ideasID: ideasID
        }, (err, check) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: 'check like dont work'
            })
            if (check.dislike === true) {
                check.dislike = false
                check.like = true
                await check.save()
                const addLike = await Ideas.findById({ _id: ideasID })
                const numberOfLike = addLike.numberOfLike + 1
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfLike }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'number of like update successfully'
                })
            } else if (check.like === true) {
                check.deleteOne()
            }
            // return res.status(200).send({
            //     errorCode: 0,
            //     message: 'click like successfully!'
            // })
        })
        // xóa bản ghi like và dislike là false
        // const deleteLike = Like.find({like: false, dislike: false})
        // deleteLike.delete()

        //hiện tại ở đây đang là tạo object mới nên sẽ k có trường hợp dòng 59.
        // cần xét thêm trường hợp tìm accountid và ideasID đã tạo và chỉnh sửa dislike nếu nó là true
        if (!tim) {
            const like = new Like({ like: true })
            await like.save()
            const addLike = await Ideas.findById({ _id: ideasID })
            const numberOfLike = addLike.numberOfLike + 1
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfLike }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'number of like update successfully'
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

        const tim = await Like.findOne({
            accountID: accountID,
            ideasID: ideasID
        }, (err, check) => {
            if (err) return res.status(500).send({
                errorCode: 500,
                message: 'check like dont work'
            })
            if (check.like === true) {
                check.like = false
                check.dislike = true
                await check.save()
                const addLike = await Ideas.findById({ _id: ideasID })
                const numberOfLike = addLike.numberOfDislike + 1
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'number of dislike update successfully'
                })
            } else if (check.dislike === true) {
                check.deleteOne()
            }
        })
        if (!tim) {
            const like = new Like({ dislike: true })
            await like.save()
            const addLike = await Ideas.findById({ _id: ideasID })
            const numberOfLike = addLike.numberOfDislike + 1
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'number of dislike update successfully'
            })
        }
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