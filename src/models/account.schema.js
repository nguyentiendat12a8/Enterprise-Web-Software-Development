const mongoose = require('mongoose')

exports.Account = mongoose.model(
    'Account',
    new mongoose.Schema({
        accountEmail: {type: String, required: true},
        accountPassword: {type: String, required: true},
        phone: {type: Number, required: true},
        address: String,
        gender:String,
        DOB: Date,
        avatar: String,
        roleID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }]
    })
)
