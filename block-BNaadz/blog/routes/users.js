var express = require('express');
var router = express.Router();
var User = require('../models/User');
var auth = require('../middlewares/auth');
const app = require('../app');
/* register */
router.get('/register', function (req, res, next) {
  res.render('register', { error: req.flash('error')[0] });
});
router.post('/register', (req, res, next) => {
  User.create(req.body, (err, user) => {
    if (err) {
      // if (err.name == 'ValidatorError') {
      req.flash('error', err.message);
      return res.redirect('/users/register');
      // }
    }
    res.redirect('/users/login');
  });
});
//login
router.get('/login', (req, res) => {
  res.render('login', { error: req.flash('error')[0] });
});
router.post('/login', (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash('error', 'Username & password are required');
    return res.redirect('/users/login');
  }
  User.findOne({ email }, (err, user) => {
    if (err) return next(err);
    if (!user) {
      req.flash('error', 'Username not found, "Register First"');
      return res.redirect('/users/login');
    }
    user.verifyPassword(password, (err, result) => {
      if (err) return next(err);
      if (!result) {
        req.flash('error', 'Please Use Correct Password');
        return res.redirect('/users/login');
      }
      req.session.userId = user.id;
      res.redirect('/users/' + user.id + '/dashboard');
    });
  });
});
router.use(auth.isUserLogged);
//dashboard
router.get('/:id/dashboard', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) return next(err);
    res.render('dashboard', { user });
  });
});
module.exports = router;
