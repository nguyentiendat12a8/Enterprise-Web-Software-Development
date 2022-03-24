const mongoose = require('mongoose')

exports.View = mongoose.model(
    'View',
    new mongoose.Schema({
        ideasID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ideas'
        }],
        accountID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }]
    }, {
        timestamps: true
    })
)
