const user = require('./user.router')
const ideas = require('./ideas.router')
const closureDate = require('./closureDate.router')

function route(app) {
    app.use('/user', user)
    app.use('/ideas',ideas)
    app.use('/closureDate',closureDate)
}

module.exports = route