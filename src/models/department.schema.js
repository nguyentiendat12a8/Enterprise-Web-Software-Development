const mongoose = require('mongoose')

exports.Department = mongoose.model(
    'Department',
    new mongoose.Schema({
        departmentName: {type: String, required: true},
    })
)
