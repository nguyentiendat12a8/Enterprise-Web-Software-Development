const mongoose = require('mongoose')

exports.ClosureDate = mongoose.model(
    'ClosureDate',
    new mongoose.Schema({
        firstClosureDate: {type: Date, required: true},
        finalClosureDate: {type: Date, required: true},
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
