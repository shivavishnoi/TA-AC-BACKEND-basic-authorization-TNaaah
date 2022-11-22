var express = require('express');
var router = express.Router();
var User = require('../models/User');
var Article = require('../models/Article');
const auth = require('../middlewares/auth');

router.use(auth.isUserLogged);
//add article
router.get('/:id/add', (req, res, next) => {
  var userId = req.params.id;
  User.findById(userId, (err, user) => {
    if (err) return next(err);
    res.render('addArticle', { user, err: req.flash('error')[0] });
  });
});
router.post('/:id/add', (req, res, next) => {
  var userId = req.params.id;
  Article.create(req.body, (err, article) => {
    if (err) {
      if (err.code === 11000) {
        req.flash('error', 'Use Unique title');
        return res.redirect(`/articles/${userId}/add`);
      }
    }
    res.redirect(`/articles/${userId}/list`);
  });
});
//list article
router.get('/:id/list', (req, res, next) => {
  var userId = req.params.id;
  Article.find({}, (err, articles) => {
    if (err) return next(err);
    res.render('listArticles', { articles, userId });
  });
});
//details
router.get('/:id/:slug/details', (req, res, next) => {
  var userId = req.params.id;
  var slug = req.params.slug;
  Article.findOne({ slug })
    .populate('comments')
    .exec((err, article) => {
      if (err) return next(err);
      res.render('details', { article, userId });
    });
  // Article.findOne({ slug }, (err, article) => {
  //   if (err) return next(err);
  //   res.render('details', { article, userId });
  // });
});
//like
router.get('/:slug/like', (req, res, next) => {
  var slug = req.params.slug;
  Article.findOneAndUpdate(
    { slug },
    { $inc: { likes: 1 } },
    { new: true },
    (err, article) => {
      if (err) return next(err);
      res.redirect('back');
    }
  );
});
module.exports = router;
