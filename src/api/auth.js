const passport = require('passport')
const authRouter = require('express').Router()

authRouter.get('/complete', (req, res) => {
  console.log(req.query)

  res.json('ok')
})

module.exports = authRouter
