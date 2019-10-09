const passport = require('passport')

module.exports = function(app) {
  // MIDDLEWARE
  app.use(passport.authenticate('github'))

  // ROUTES
  app.use('/auth', require('./auth'))
  app.use('/events', require('./events'))
}
