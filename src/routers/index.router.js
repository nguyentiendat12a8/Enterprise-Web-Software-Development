const user = require('./user.router')
const ideas = require('./ideas.router')
const closureDate = require('./closureDate.router')
const department = require('./department.router')
const category = require('./category.router')

function route(app) {
    app.use('/user', user)
    app.use('/ideas',ideas)
    app.use('/closureDate',closureDate)
    //app.use('/department',department)
    app.use('/category',category)
}

module.exports = route