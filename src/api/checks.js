const checkRouter = require('express').Router()
const Check = require('../models/Check')

checkRouter.get('/:id', (req, res) => {
  Check.findById(req.params.id, (err, check) => {
    if (err) res.status(500).json(err)

    res.json(check)
  })
})

checkRouter.post('/:id', (req, res) => {
  const { approved, comment } = req.body

  // With the comment we need to create a new PR comment
  Check.findOne({ _id: req.params.id }, (err, check) => {
    if (err) throw err
    if (check) {
      check.updateDecision(req.body)
    } else {
      return res.status(400).json('Check does not exist')
    }

    res.json('ok')
  })
})

module.exports = checkRouter
