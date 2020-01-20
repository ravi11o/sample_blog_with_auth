var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET users listing. */
router.get('/register', function(req, res, next) {
  // console.log(req.flash('error'));
  res.render('register');
});

router.post('/register', (req, res) => {
  User.create(req.body, (err, user) => {
    if(err) {
      // console.log(err.errmsg);
      // req.flash('error', 'Something went wrong');
       return res.redirect('/users/register');
    }
    res.redirect('/users/login');
  })
});

router.get('/login', (req, res) => {
  var msg = req.flash('info')[0];
  console.log(msg);

  res.render('login', {msg});
});

router.post('/login', (req, res) => {
  var { email, password } = req.body;
  User.findOne({email}, (err, user) => {
    if(err) return res.redirect('/users/login');
    if(!user) return res.redirect('/users/login');
    if(!user.verifyPassword(password)) return res.redirect('/users/login');
    req.session.userId = user.id;
    res.redirect('/');
  })
})


module.exports = router;
