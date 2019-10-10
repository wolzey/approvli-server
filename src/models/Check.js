const mongoose = require('mongoose')
const github = require('../services/github')

const Schema = mongoose.Schema

const CheckSchema = new Schema({
  pull_request: {
    body: {
      type: String,
    },
    id: {
      type: Number,
    },
  },
  owner: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    enum: ['in_progress', 'completed', 'queued'],
    default: 'in_progress',
  },
  name: {
    type: String,
    default: 'Designer Approval',
    required: true,
  },
  repo: {
    type: String,
    required: true,
  },
  head_sha: {
    type: String,
    required: true,
    unique: true,
  },
  summary: {
    title: String,
    summary: String,
    text: String,
  },
  conclusion: String,
  started_at: {
    type: Date,
    default: Date.now,
    required: true,
  },
  installation_id: {
    type: Number,
    required: true,
  },
})

CheckSchema.path('head_sha').set(function() {
  const originalSha = this.head_sha
  this._head_sha = originalSha
})

CheckSchema.pre('save', async function(next) {
  const { id } = await this.sendToGithub()
  await this.runUpdateChecks()

  this.id = id

  next()
})

CheckSchema.methods.runUpdateChecks = async function() {
  if (this.status !== 'in_progress') return
  const client = github(this.installation_id)

  await client.checks.update({
    owner: this.owner.login,
    repo: this.repo,
    check_run_id: this.id,
    conclusion: 'cancelled',
    status: 'completed',
  })
}

CheckSchema.methods.sendToGithub = async function() {
  const client = github(this.installation_id)

  return await client.checks.create({
    head_sha: this.head_sha,
    owner: this.owner.login,
    repo: this.repo,
    started_at: this.started_at,
    status: this.status,
    summary: this.summary,
    name: this.name,
  })
}

CheckSchema.methods.sendSlackNotification = function() {}

CheckSchema.methods.updateInGithub = function() {}

module.exports = new mongoose.model('Check', CheckSchema)
