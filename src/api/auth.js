const passport = require('passport')
const authRouter = require('express').Router()

// This is a test

authRouter.get('/complete', (req, res) => {
  console.log(req.query)

  res.json('ok')
})

// test pr

module.exports = authRouter
