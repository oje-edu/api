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

const PORT = process.env.PORT || 5000

app.listen(
  PORT,
  console.log(`Server brennt die Adresse http://localhost:${PORT} im ${process.env.NODE_ENV} modus ab.`)
)