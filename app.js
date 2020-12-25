const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')(session)
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')


// Load config
dotenv.config({ path: './config/config.env' })


connectDB()
const app = express()

// middleware
app.use(express.static('public'));

// view engine
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));



// sessions
app.use(
  session({
    key: "userId",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);

// routes

app.get('/api', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes);



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