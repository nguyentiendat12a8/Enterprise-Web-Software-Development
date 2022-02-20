const user = require('./user.router')

function route(app) {
    app.use('/user', user)
}

module.exports = route