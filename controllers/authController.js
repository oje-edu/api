const User = require('../models/User');
const jwt = require('jsonwebtoken');

// error handler
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // wrong password or email
  if (err.message === 'incorrect email') {
    errors.email = 'Diese @-Adresse scheint nicht registriert zu sein.'
  }

  if (err.message === 'incorrect password') {
    errors.password = 'Das angegebene Passwort ist falsch.'
  }

  // duplicate error
  if (err.code === 11000) {
    errors.email = 'Diese @-Adresse scheint bereits registriert zu sein.'
    
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
}

// times in seconds for jwt expiresIn value (not the cookie value what needs milliseconds!)
const maxAge = 1 * 24 * 60 * 60;

// jwt
const createToken = (id) => {
  return jwt.sign({ id }, process.env.TOKEN_SECRET, {
    expiresIn: maxAge
  });
} 

// controller actions
module.exports.signup_get = (req, res) => {
  res.render('registrieren');
}

module.exports.login_get = (req, res) => {
  res.render('anmelden');
}

module.exports.signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    // place response into a cookie and set maxAge time to milliseconds
    res.cookie('OJEeinSYSTEMVERNICHTER', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

module.exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    // place response into a cookie and set maxAge time to milliseconds
    res.cookie('OJEeinSYSTEMVERNICHTER', token, { httpOnly: true, maxAge: maxAge * 1000 });      
    res.status(200).json({ user: user._id});
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
}

// logout
module.exports.logout_get = (req, res) => {
  res.cookie('OJEeinSYSTEMVERNICHTER', 'KILL!', { maxAge: 1 });
  res.redirect('/start');
}