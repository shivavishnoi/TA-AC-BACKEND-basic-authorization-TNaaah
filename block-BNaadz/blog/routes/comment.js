var express = require('express');
var router = express.Router();
var Comment = require('../models/Comment');
var Article = require('../models/Article');
const auth = require('../middlewares/auth');

router.use(auth.isUserLogged);
router.post('/:userId/:articleId/add', (req, res, next) => {
  var articleId = req.params.articleId;
  req.body.articleId = articleId;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    Article.findByIdAndUpdate(
      articleId,
      { $push: { comments: comment._id } },
      { new: true },
      (err, article) => {
        if (err) return next(err);
        res.redirect(
          '/articles/' + req.params.userId + '/' + article.slug + '/details'
        );
      }
    );
  });
});

module.exports = router;
