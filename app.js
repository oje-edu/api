const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const bcrypt = require('bcrypt')
const saltRounds = 13

const jwt = require('jsonwebtoken')

// Load config
dotenv.config({ path: './config/config.env' })

connectDB()
const app = express()

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

var corsOptions = {
  origin: ['oje.ooo', '*.oje.ooo', 'http://localhost:3000']
};

// sessions
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
)

// static folder
app.use(express.static(path.join(__dirname, 'public')))

// logging
const pino = require('pino')
const dest = pino.destination({ sync: false })
const logger = pino(dest)

setInterval(function () {
  logger.flush()
}, 10000).unref()
const handler = pino.final(logger, (err, finalLogger, evt) => {
  finalLogger.info(`${evt} caught`)
  if (err) finalLogger.error(err, 'error caused exit')
  process.exit(err ? 1 : 0)
})
process.on('beforeExit', () => handler(null, 'beforeExit'))
process.on('exit', () => handler(null, 'exit'))
process.on('uncaughtException', (err) => handler(err, 'uncaughtException'))
process.on('SIGINT', () => handler(null, 'SIGINT'))
process.on('SIGQUIT', () => handler(null, 'SIGQUIT'))
process.on('SIGTERM', () => handler(null, 'SIGTERM'))

const PORT = process.env.PORT || 5050

app.listen(
  PORT,
  console.log(`Server brennt die Adresse http://localhost:${PORT} im ${process.env.NODE_ENV} modus ab.`)
)