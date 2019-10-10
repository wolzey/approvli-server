require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const logger = require('morgan')
const passport = require('passport')
const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/approvli', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
})

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

require('./src/strategies')
require('./src/api')(app)

app.listen(process.env.PORT || 3000, () => {
  console.log('Server running')
})
