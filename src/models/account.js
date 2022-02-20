const mongoose = require('mongoose')

exports.Account = mongoose.model(
    'Account',
    new mongoose.Schema({
        username: String,
        password: String,
        email: String,
        avatar: String,
        roles: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }]
    })
)
