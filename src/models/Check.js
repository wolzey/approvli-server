const mongoose = require('mongoose')
const github = require('../services/github')

const Schema = mongoose.Schema

// Test
const CheckSchema = new Schema({
  pull_request: {
    type: Number,
    required: true,
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

CheckSchema.methods.sendToGithub = async function() {
  const client = github(this.installation_id)
  console.log('CREATING IN GITHUB')
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