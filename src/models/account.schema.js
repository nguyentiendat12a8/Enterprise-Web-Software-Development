const mongoose = require('mongoose')
const Joi = require("joi")

exports.Account = mongoose.model(
    'Account',
    new mongoose.Schema({
        accountEmail: {type: String, required: true},
        accountPassword: {type: String, required: true},
        phone: {type: Number, required: true},
        address: String,
        gender:String,
        DOB: {type: String},
        avatar: String,
        deleted: {type: Boolean, default: false},
        roleID: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        }]
    }, {
        timestamps: true
    })
)

// exports.validateAccount = (account) =>{
//     const schema = Joi.object({
//         accountEmail: Joi.string().email().max(30).required(),
//         accountPassword: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{6,30}$')).required(),
//         phone: Joi.string().required(),
//         gender: Joi.options([male,female]),

//     })
//     return schema.validate(user)
// }