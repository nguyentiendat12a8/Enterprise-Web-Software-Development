const db = require('../models/index')
const Ideas = db.ideas
const View = db.view

exports.checkView = async (req, res, next) => {
    const ideasID = req.params.ideasID
    const accountID = req.accountID
    const check = await View.findOne({
        accountID: accountID,
        ideasID: ideasID
    })
    if (!check) {
        const view = new View({
            accountID,
            ideasID
        })
        await Promise.all([view.save(), View.countDocuments({ ideasID })])
            .then(async ([view, number]) => {
                var count = number + 1
                await Ideas.findByIdAndUpdate({ _id: ideasID }, { numberOfView: count }, { new: true })
                next()
            })
            .catch(err => next())
    } else {
        next()
    }
}