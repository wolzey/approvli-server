const checkRouter = require('express').Router()
const Check = require('../models/Check')

checkRouter.get('/:id', (req, res) => {
  Check.findById(req.params.id, (err, check) => {
    if (err) res.status(500).json(err)

    res.json(check)
  })
})

module.exports = checkRouter
