const mongoose = require('mongoose')

exports.Category = mongoose.model(
    'Category',
    new mongoose.Schema({
        categoryName: {type: String, required: true},
        accountID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Account'
        }],
        departmentID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }]
    })
)
