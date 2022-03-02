const { string } = require('joi')
const mongoose = require('mongoose')

exports.ClosureDate = mongoose.model(
    'ClosureDate',
    new mongoose.Schema({
        firstClosureDate: {type: String, required: true},
        finalClosureDate: {type: String, required: true},
        // accountID: [{
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: 'Account'
        // }],
        departmentID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }]
    })
)
