const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { Account } = require("./account")
const { Role } = require("./role")

const db = {}

db.mongoose = mongoose

db.account = Account
db.role = Role

db.ROLES = ['staff', 'admin','QA', 'QA of IT','QA of the system','QA of personel']

module.exports = db