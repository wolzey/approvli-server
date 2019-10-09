const eventRouter = require('express').Router()
const github = require('../services/github')

const WATCHABLE_EVENTS = ['pull_request']

eventRouter.post('/', async (req, res) => {
  const event = req.header('X-GitHub-Event')
  const body = req.body
  const { pull_request, repository, installation } = body

  const githubClient = github(installation.id)

  if (!WATCHABLE_EVENTS.includes(event)) return res.json('event not supported')

  const hasDesignLabel =
    pull_request.labels &&
    pull_request.labels.find(
      label => label.name.toLowerCase() === 'designer review requested'
    )

  if (!hasDesignLabel) return res.json('Nothing to do... Label not added')

  githubClient.apps.createInstallationToken({
    installation_id: installation.id,
  })

  const response = await githubClient.apps.getAuthenticated()

  console.log(response)
  // If Designer requested we use the api to create a new check
  // Check is in progress
  // Send notitification to Slack
  // Once Kevin (designer approves) - Change status to his selection
  // Add PR comments if any

  res.status(200).json('ok')
})

module.exports = eventRouter
