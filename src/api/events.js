const eventRouter = require('express').Router()
const { createCheck } = require('../services/checks')

const WATCHABLE_EVENTS = ['pull_request']

eventRouter.post('/', (req, res) => {
  const event = req.header('X-GitHub-Event')
  const body = req.body

  if (!WATCHABLE_EVENTS.includes(event)) return res.json('event not supported')

  const hasDesignLabel =
    req.body.labels &&
    req.body.labels.find(
      label => label.name.toLowerCase() === 'designer review requested'
    )

  if (!hasDesignLabel) return res.json('Nothing to do... Label not added')

  createCheck({
    status: 'in_progress',
    head_sha: body.head.sha,
    owner: body.repo.owner,
    repo: body.repo,
  })

  // If Designer requested we use the api to create a new check
  // Check is in progress
  // Send notitification to Slack
  // Once Kevin (designer approves) - Change status to his selection
  // Add PR comments if any

  res.status(200).json('ok')
})

module.exports = eventRouter
