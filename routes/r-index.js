const rAuth = require('./r-auth')
const rUserCategories = require('./r-userCategories')
const isAuthenticated = require('../middlewares/isAuthenticated')

module.exports = (app) => {
    app.use('/auth', rAuth)
    // app.use('/users', isAuthenticated, rUserCategories)
}