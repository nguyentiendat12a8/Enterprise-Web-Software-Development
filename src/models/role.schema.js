const mongoose = require('mongoose')

exports.Role = mongoose.model(
    'Role',
    new mongoose.Schema({
        roleName: String
    })
)


