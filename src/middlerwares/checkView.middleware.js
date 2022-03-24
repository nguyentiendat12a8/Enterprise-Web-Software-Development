const db = require('../models/index')
const Ideas = db.ideas
const View = db.view

exports.checkView = async (req, res, next) => {
    const ideasID = req.params.ideasID //params ?
    const accountID = req.accountID // req.accountID
    const check = await View.findOne({
        accountID: accountID,
        ideasID: ideasID
    })
    if (check === null) {
        const view = new View({
            accountID,
            ideasID
        })
        await view.save()
        const number = await View.find({ ideasID })
        let sumView = 0
        number.forEach(() => {
            sumView++
        })
        await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfView: sumView }, { new: true })
        next()
    } else {
        next()
    }
}