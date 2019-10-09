const eventRouter = require('express').Router()

eventRouter.post('/', (req, res) => {
  console.log(req.body)
  res.status(200).json('ok')
})

module.exports = eventRouter
