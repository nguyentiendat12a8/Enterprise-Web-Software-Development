const mongoose = require('mongoose')

exports.Like = mongoose.model(
    'Like',
    new mongoose.Schema({
        like: {type: Boolean, default: false},
        dislike: {type: Boolean, default: false},
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
