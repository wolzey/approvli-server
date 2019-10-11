const eventRouter = require('express').Router()
const github = require('../services/github')
const Check = require('../models/Check')
// Hi
const WATCHABLE_EVENTS = ['pull_request']

eventRouter.post('/', async (req, res) => {
  const event = req.header('X-GitHub-Event')
  const body = req.body
  const { pull_request, installation } = body

  console.log(pull_request)

  if (!WATCHABLE_EVENTS.includes(event)) return res.json('event not supported')

  const hasDesignLabel =
    pull_request.labels &&
    pull_request.labels.find(
      label => label.name.toLowerCase() === 'designer review requested'
    )

  if (!hasDesignLabel) return res.json('Nothing to do... Label not added')
  // Needs to create check in DB, initialization will create this.

  await Check.findOrCreate(
    {
      'pull_request.id': pull_request.id,
    },
    {
      pull_request: {
        id: pull_request.id,
        body: pull_request.body,
      },
      owner: pull_request.head.repo.owner,
      repo: pull_request.head.repo.name,
      status: 'in_progress',
      head_sha: pull_request.head.sha,
      installation_id: installation.id,
      output: {
        title: 'Waiting on Design Approval',
        summary: 'Needs approval from a designer',
        text:
          'We have sent a request to design. Once approved this check will update with their response.',
      },
    }
  )

  res.json('ok')
  // If Designer requested we use the api to create a new check
  // Check is in progress
  // Send notitification to Slack
  // Once Kevin (designer approves) - Change status to his selection
  // Add PR comments if any
})

module.exports = eventRouter
