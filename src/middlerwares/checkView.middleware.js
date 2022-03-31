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
        await Promise.all([view.save(), View.find({ ideasID })])
        .then(async ([number]) => {
            await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfView: number.length }, { new: true })
        next()
        })
        .catch(err => next())
    } else {
        next()
    }
}