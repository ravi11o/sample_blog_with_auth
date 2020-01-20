var express = require('express');
var router = express.Router();
var Article = require('../models/article');
var Comment = require('../models/comment'); 
var middleware = require('../modules/middlewares');



router.get('/',  async (req, res) => {
  try {
    var articles = await Article.find();
    res.render('articles', {articles});
  } catch (err) {
    next(err);
  }
});


router.post('/', middleware.checkUserLogged, (req, res, next) => {
  Article.create(req.body, (err, createdArticle) => {
    if (err) return next(err);
    res.redirect('/articles');
  })
});

// router.get('/:id', (req, res, next) => {
//   Article.findById(req.params.id, (err, article) => {
//     Comment.find({articleId: req.params.id}, (err, comments) => {
//      res.render('singleArticle', {article, comments});
//     })
//   })
// })



router.get('/:id', (req, res, next) => {
  Article
    .findById(req.params.id)
    .populate('comments', "content")
    .exec((err, article) => {
      res.render('singleArticle', {article})
  })
});

router.use(middleware.checkUserLogged)


router.post('/:articleId/comments',  (req, res) => {
  var articleId = req.params.articleId;
  req.body.articleId = articleId;
  Comment.create(req.body, (err, comment) => {
    Article.findByIdAndUpdate(articleId, {$push: {comments: comment.id}}, (err, article) => {
     res.redirect('/articles/' + articleId);
    })
  })
})

router.get('/:id/likes',(req, res) => {
  Article.findByIdAndUpdate(req.params.id, {$inc: {likes: 1}}, (err, article) => {
    res.redirect('/articles/' + req.params.id);
  })
})



module.exports = router;