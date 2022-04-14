const db = require('../models/index')

const Ideas = db.ideas
const Like = db.like

exports.checkLike = async (req, res, next) => {
    try {
        const ideasID = req.params.ideasID //params ?
        const accountID = req.accountID // req.accountID

        const check = await Like.findOne({
            accountID: accountID,
            ideasID: ideasID
        })
        if (check) {
            if (check.dislike === true) {
                check.dislike = false
                check.like = true
                await check.save()
                const number = await Like.find({ ideasID })
                let sumLike = 0
                let sumDislike = 0
                number.forEach(e => {
                    if (e.like === true) {
                        sumLike = sumLike + 1
                    }
                    if (e.dislike === true) {
                        sumDislike = sumDislike + 1
                    }
                })
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfLike: sumLike, numberOfDislike: sumDislike }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'number of like update successfully'
                })
            } else if (check.like === true) {
                await check.delete()
                const number = await Like.find({ ideasID })
                let sumDislike = 0
                let sumLike = 0
                number.forEach(e => {
                    if (e.dislike === true) {
                        sumDislike = sumDislike + 1
                    }
                    if (e.like === true) {
                        sumLike = sumLike + 1
                    }
                })
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike: sumDislike, numberOfLike: sumLike }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'unlike successfully'
                })
            }
        }
        next()
    } catch (error) {
        return res.status(500).send({
            errorCode: 500,
            message: 'check like function is error'
        })
    }

}

exports.checkDislike = async (req, res, next) => {
    try {
        const ideasID = req.params.ideasID //params ?
        const accountID = req.accountID // req.accountID

        const check = await Like.findOne({
            accountID: accountID,
            ideasID: ideasID
        })
        if (check) {
            if (check.like === true) {
                check.like = false
                check.dislike = true
                await check.save()
                const number = await Like.find({ ideasID })
                let sumDislike = 0
                let sumLike = 0
                number.forEach(e => {
                    if (e.dislike === true) {
                        sumDislike = sumDislike + 1
                    }
                    if (e.like === true) {
                        sumLike = sumLike + 1
                    }
                })
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike: sumDislike, numberOfLike: sumLike }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'number of dislike update successfully'
                })
            } else if (check.dislike === true) {
                await check.delete()
                const number = await Like.find({ ideasID })
                let sumDislike = 0
                let sumLike = 0
                number.forEach(e => {
                    if (e.dislike === true) {
                        sumDislike = sumDislike + 1
                    }
                    if (e.like === true) {
                        sumLike = sumLike + 1
                    }
                })
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike: sumDislike, numberOfLike: sumLike }, { new: true })
                return res.status(200).send({
                    errorCode: 0,
                    message: 'undislike successfully'
                })
            }
        }
        next()
    } catch (error) {
        if (err) return res.status(500).send({
            errorCode: 500,
            message: 'check dislike function is error'
        })
    }
}

