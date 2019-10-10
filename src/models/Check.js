const mongoose = require('mongoose')
const github = require('../services/github')

const Schema = mongoose.Schema

const CheckSchema = new Schema({
  check_run_id: {
    type: Number,
  },
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

CheckSchema.pre('update', async function(next) {
  console.log('UPDATING....')
  await this.sendToGithub()
  next()
})

CheckSchema.methods.sendToGithub = async function() {
  const client = github(this.installation_id)
  const { id } = await client.checks.create({
    head_sha: this.head_sha,
    owner: this.owner.login,
    repo: this.repo,
    started_at: this.started_at,
    status: this.status,
    summary: this.summary,
    name: this.name,
  })

  if (this.check_run_id) {
    await this.runUpdateChecks()
  }

  this.check_run_id = id
  this.save()
}

CheckSchema.methods.sendSlackNotification = function() {}

CheckSchema.methods.updateInGithub = function() {}

module.exports = new mongoose.model('Check', CheckSchema)
