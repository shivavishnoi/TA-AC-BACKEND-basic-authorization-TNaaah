var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.clearCookie('connect.sid');
  res.redirect('/users/login');
});
module.exports = router;
