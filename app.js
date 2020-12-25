const express = require('express')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const cookieParser = require('cookie-parser')


// Load config
dotenv.config({ path: './config/config.env' })


connectDB()
const app = express()

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');



// routes
app.get('/start', (req, res) => res.render('start'));
app.get('/posts', (req, res) => res.render('posts'));
app.use(authRoutes);

// // kekse
// app.get('/set-cookies', (req, res) => {
//   res.cookie('newUser', false, { secure: true, httpOnly: true });
//   res.cookie('isHTMLHacker', true, { maxAge: 1000 * 60 * 60 * 24, secure: true, httpOnly: true });

//   res.send('Glückwunsch zum Krümelmonster erster Klasse!')
// });

// app.get('/read-cookies', (req, res) => {
//   const cookies = req.cookies;
//   console.log(cookies);

//   res.json(cookies);
// });


const PORT = process.env.PORT || 5512

app.listen(
  PORT,
  console.log(`Server brennt die Adresse http://localhost:${PORT} im ${process.env.NODE_ENV} modus ab.`)
)