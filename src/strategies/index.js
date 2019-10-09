const GitHubStrategy = require('passport-github').Strategy
const passport = require('passport')

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    },
    function(accessToken, refreshToken, profile, cb) {
      // TODO: Find or Create user from ANYDB
      console.log(profile, accessToken, refreshToken)
    }
  )
)
