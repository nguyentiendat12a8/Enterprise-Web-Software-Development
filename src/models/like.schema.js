const mongoose = require('mongoose')

exports.Like = mongoose.model(
    'Like',
    new mongoose.Schema({
        like: {type: Boolean},
        dislike: {type: Boolean},
        ideasID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ideas'
        }],
        accountID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }]
    })
)
