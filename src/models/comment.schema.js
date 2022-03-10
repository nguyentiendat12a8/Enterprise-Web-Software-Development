
const mongoose = require('mongoose')

exports.Comment = mongoose.model(
    'Comment',
    new mongoose.Schema({
        commentText: { type: String, required: true },
        //commentTimeUp: {type: Date, default: Date.now()},
        accountID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }],
        ideasID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Ideas'
        }]
    }, {
        timestamps: true
    }
    )
)
