const rAuth = require('./r-auth')
const rUserCategories = require('./r-userCategories')
const isAuthorized = require('../middlewares/isAuthorized')

module.exports = (app) => {
    app.use('/auth', rAuth)
    app.use('/userCategories', isAuthorized, rUserCategories)
}