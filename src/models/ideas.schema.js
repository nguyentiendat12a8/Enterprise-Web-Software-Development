const mongoose = require('mongoose')

exports.Ideas = mongoose.model(
    'Ideas',
    new mongoose.Schema({
        ideasContent: {type: String, required: true},
        ideasFile: {type: String},
        numberOfLike: {type: Number, default : 0},
        numberOfDislike: {type: Number, default : 0},
        numberOfComment: {type: Number, default : 0},
        numberOfView: {type: Number, default : 0},
        anonymous: {type: Boolean, default: false}, 
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
