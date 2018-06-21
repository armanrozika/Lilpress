let express = require('express'),
   router = express.Router(),
   bcrypt = require('bcryptjs'),
   passport = require('passport'),
   multer = require('multer');

let User = require('../models/user');

//register User
router.get('/register', function(req, res){
   res.render('register',{
      layout: 'main.handlebars'
   });
});

router.post('/register', function(req, res){
   console.log(req.body);
   req.checkBody('name', 'Name required').notEmpty();
   req.checkBody('email', 'Email required').notEmpty();
   req.checkBody('username', 'Username required').notEmpty();
   req.checkBody('password', 'Password required').notEmpty();
   req.checkBody('password2', 'Password do not match').equals(req.body.password);

   let errors = req.validationErrors();

   if(errors){
      res.render('register', {
         errors: errors
      });
   }else{
      let newUser = new User({
         name: req.body.name,
         email: req.body.email,
         username: req.body.username,
         password: req.body.password,
         password2: req.body.password2
      });

      bcrypt.genSalt(10, function(err, salt){
         bcrypt.hash(newUser.password, salt, function(err, hash){
            if(err){
               console.log(err);
            }
            newUser.password = hash;
            newUser.save(function(err){
               if(err){
                  console.log(err);
                  return;
               }else{
                  req.flash('success', 'You are now registered, please Login');
                  res.redirect('/login');
               }
            })
         });
      })
   }
});

//login page
router.get('/login', function(req,res){
   res.render('login', {
      layout: 'main.handlebars',
      messages: require('express-messages')(req, res)()
   });
});

//login process
router.post('/login', function(req, res, next){
   passport.authenticate('local', {
      successRedirect : '/dashboard',
      failureRedirect: '/user/login',
      failureFlash: true

   })(req, res, next);
})

module.exports = router;
