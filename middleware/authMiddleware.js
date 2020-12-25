const jwt = require('jsonwebtoken');
const User = require('../models/User');

const requireAuth = (req, res, next) => {

  const token = req.cookies.OJEeinSYSTEMVERNICHTER;

  // check if jwt exists and is verified
  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect('/anmelden');
      } else {
        console.log(decodedToken);
        next();
      }
    })
  } else {
    res.redirect('/anmelden');
  }
}

// check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.OJEeinSYSTEMVERNICHTER;

  if (token) {
    jwt.verify(token, process.env.TOKEN_SECRET, async (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    })
  } else {
    res.locals.user = null;
    next();
  }
}

module.exports = { requireAuth, checkUser };