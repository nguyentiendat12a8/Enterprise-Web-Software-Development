const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const { Account } = require("./account.schema")
const { Role } = require("./role.schema")
const {ResetPassword} = require('./resetPassword.schema')
const {Category} = require('./category.schema')
const {ClosureDate} = require('./closureDate.schema')
const {Comment} = require('./comment.schema')
const {Department} = require('./department.schema')
const {Ideas} = require('./ideas.schema')
const {Like} = require('./like.schema')
const db = {}

db.mongoose = mongoose
db.account = Account
db.role = Role
db.resetPassword = ResetPassword
db.category = Category
db.closureDate = ClosureDate
db.comment = Comment
db.department = Department 
db.ideas = Ideas 
db.like = Like 

// db.ROLES = ['staff', 'admin','QA', 'QA of IT','QA of business','QA of graphic design']

module.exports = db