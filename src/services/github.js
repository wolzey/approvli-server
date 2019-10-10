const { App } = require('@octokit/app')
const Octokit = require('@octokit/rest')
const fs = require('fs')

const app = new App({
  id: process.env.GITHUB_APP_ID,
  privateKey: process.env.GITHUB_PRIVATE_KEY,
})

module.exports = function createClient(installationId) {
  const octokit = new Octokit({
    async auth() {
      const installationAccessToken = await app.getInstallationAccessToken({
        installationId,
      })

      return installationAccessToken
    },
  })

  return octokit
}
