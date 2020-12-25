const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Bitte Deine @-Adresse angeben.'],
    unique: true,
    lowercase: true,
    validate: [isEmail, 'Bitte eine gültige @-Adresse angeben!']
  },
  password: {
    type: String,
    required: [true, 'Ein Passwort wird neuerdings benötigt.'],
    minlength: [8, 'Das Passwort muss mindestens 8 Zeichen lang sein.']
  },
});

// fire a function _before_ the doc is saved to db
userSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(13);
  this.password = await bcrypt.hash(this.password, salt);
  next();
})

// mongoose hook to fire a function after the doc was saved to the db
userSchema.post('save', function (doc, next) {
  console.log('user wird erstellt & gespeichert', doc);
  // go to next middleware
  next();
});

// static mthod to login a user
userSchema.statics.login = async function(email, password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error('Falsche Email/Passwort');
   }
  throw Error('False Email/Passwort');
}

const User = mongoose.model('user', userSchema);

module.exports = User;