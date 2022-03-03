const db = require('../models/index')

const Ideas = db.ideas
const ClosureDate = db.closureDate
const Department = db.department
const Like = db.like

exports.checkLike = async (req, res, next) => {

    const ideasID = req.body.ideasID //params ?
    const accountID = req.body.accountID // req.accountID

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
                if(e.like === true){
                    sumLike = sumLike + 1
                }
                if(e.dislike === true){
                    sumDislike = sumDislike+1
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
                if(e.dislike === true){
                    sumDislike = sumDislike + 1
                }
                if(e.like === true){
                    sumLike =sumLike+1
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
}

exports.checkDislike = async (req, res, next) => {

    const ideasID = req.body.ideasID //params ?
    const accountID = req.body.accountID // req.accountID

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
                if(e.dislike === true){
                    sumDislike = sumDislike + 1
                }
                if(e.like === true){
                    sumLike =sumLike+1
                }
            })
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfDislike: sumDislike, numberOfLike: sumLike }, { new: true })
            return res.status(200).send({
                errorCode: 0,
                message: 'number of like update successfully'
            })
        } else if (check.dislike === true) {
            await check.delete()
            const number = await Like.find({ ideasID })
            let sumDislike = 0
            let sumLike = 0
            number.forEach(e => {
                if(e.dislike === true){
                    sumDislike = sumDislike + 1
                }
                if(e.like === true){
                    sumLike =sumLike+1
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
}