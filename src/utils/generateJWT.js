const jwt = require('jsonwebtoken')
const fs = require('fs')
const octokit = require('@octokit/rest')

module.exports = async function(installation_id) {
  const PEM = fs.readFileSync('/approvli.pem', 'utf-8')

  const jwtToken = jwt.sign(
    {
      iat: Math.floor(new Date() / 1000),
      exp: Math.floor(new Date() / 1000) + 60,
      iss: process.env.GITHUB_APP_ID,
    },
    PEM,
    { algorithm: 'RS256' }
  )

  const client = octokit()
  client.authenticate({
    type: 'integration',
    token: jwtToken,
  })

  const {
    data: { token },
  } = await client.apps.createInstallationToken({
    installation_id,
  })

  return token
}
