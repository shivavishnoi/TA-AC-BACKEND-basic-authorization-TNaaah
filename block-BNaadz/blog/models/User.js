var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  full_name: { type: String },
  email: { type: String, required: true, minlength: 6, unique: true },
  password: { type: String, minlength: 5, required: true },
  country: { type: String },
});

userSchema.pre('save', function (next) {
  this.full_name = this.first_name + ' ' + this.last_name;
  next();
});

userSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    bcrypt.hash(this.password, 10, (err, hashed) => {
      if (err) return next(err);
      this.password = hashed;
      next();
    });
  } else {
    next();
  }
});

userSchema.methods.verifyPassword = function (password, cb) {
  bcrypt.compare(password, this.password, (err, result) => {
    cb(err, result);
  });
};

module.exports = mongoose.model('User', userSchema);
