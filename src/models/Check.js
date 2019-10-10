const mongoose = require('mongoose')
const github = require('../services/github')
const axios = require('axios')

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

CheckSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      await this.sendSlackNotification()
    } catch {
      console.log('could not send slack notification')
    }
  }

  next()
})

CheckSchema.methods.sendSlackNotification = async function() {
  return await axios({
    method: 'POST',
    url: process.env.SLACK_WEBHOOK_ENDPOINT,
    data: {
      text: `
        Hello! You have a new review request on ${this.owner.login}'s PR.
        Please access it here https://approvli.herokuapp.com/checks/${this._id}`,
    },
  })
}

CheckSchema.statics.findOrCreate = async function(query, data) {
  const _this = this
  return this.findOne(query, async function(err, check) {
    if (err) throw err
    if (!check) {
      _this.create(data, (err, newCheck) => {
        if (err) throw err
        newCheck.sendToGithub()
        return data
      })
    } else {
      if (!check.conclusion) {
        await check.runUpdateChecks()
      }
      // Need to make sure the hash updates
      check.set(data)
      check.save(async () => await check.sendToGithub())
    }
  })
}

CheckSchema.methods.updateDecision = async function(data) {
  const client = github(this.installation_id)
  const conclusion = data.approved ? 'success' : 'failure'
  await client.checks.update({
    owner: this.owner.login,
    repo: this.repo,
    check_run_id: this.check_run_id,
    conclusion,
    status: 'completed',
  })

  this.set({
    conclusion: data.approved ? 'success' : 'failure',
  })

  this.save()
}

CheckSchema.methods.runUpdateChecks = async function() {
  if (!this.check_run_id) return
  if (this.status !== 'in_progress') return
  const client = github(this.installation_id)

  await client.checks.update({
    owner: this.owner.login,
    repo: this.repo,
    check_run_id: this.check_run_id,
    conclusion: 'cancelled',
    status: 'completed',
  })
}

CheckSchema.methods.sendToGithub = async function() {
  const client = github(this.installation_id)
  const {
    data: { id },
  } = await client.checks.create({
    head_sha: this.head_sha,
    owner: this.owner.login,
    repo: this.repo,
    started_at: this.started_at,
    status: this.status,
    summary: this.summary,
    name: this.name,
    conclusion: this.conclusion,
    output: this.output,
  })

  this.check_run_id = id
  this.save()
}

CheckSchema.methods.updateInGithub = function() {}

module.exports = new mongoose.model('Check', CheckSchema)
