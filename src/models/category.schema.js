const mongoose = require('mongoose')

exports.Category = mongoose.model(
    'Category',
    new mongoose.Schema({
        categoryName: {type: String, required: true},
        departmentID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Department'
        }],
        
    })
)
