const passport = require('passport')
const authRouter = require('express').Router()

// Not sure this is doing anything
authRouter.get('/complete', (req, res) => {
  console.log(req.query)

  res.json('ok')
})

// test pr

module.exports = authRouter
