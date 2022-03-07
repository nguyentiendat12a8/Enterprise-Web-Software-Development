const mongoose = require('mongoose')

exports.Ideas = mongoose.model(
    'Ideas',
    new mongoose.Schema({
        ideasContent: {type: String, required: true},
        ideasFile: {type: String},
        numberOfLike: {type: Number},
        numberOfDislike: {type: Number},
        numberOfComment: {type: Number},
        closureDateID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ClosureDate'
        }],
        accountID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }],
        departmentID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }],
        categoryID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }]
    })
)
