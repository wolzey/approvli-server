const octokit = require('@octokit/rest')
const createIntegrationToken = require('../utils/generateJWT')

async function createStatusCheck(options) {
  const token = await createIntegrationToken(options.integrationId)
  const client = octokit()

  client.authenticate({
    type: 'token',
    token,
  })

  return await client.checks.create({ ...options, name: 'designer-approval' })
}

exports.createCheck = createStatusCheck
