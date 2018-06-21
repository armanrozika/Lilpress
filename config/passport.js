let LocalStrategy = require('passport-local').Strategy,
   User = require('../models/user'),
   config = require('../config/database'),
   bcrypt = require('bcryptjs');

module.exports = function(passport){
   //console.log('no user');

   passport.use(new LocalStrategy(function(username, password, done){
      let query = {username: username};
      User.findOne(query, function(err, user){
         if(err){
            throw err;
         }
         if(!user){
            console.log('no user');
            return done(null, false, {message: 'No user found'});
         }

         bcrypt.compare(password, user.password, function(err, isMatch){
            if(err){
               throw err;
            }
            if(isMatch){
               return done(null, user);
            }else{
               console.log('wrong password');
               return done(null, false, {message: 'Wrong password'});
            }
         })
      })
   }));

   passport.serializeUser(function(user, done){
      done(null, user.id);
   });

   passport.deserializeUser(function(id, done){
      User.findById(id, function(err, user){
         done(err, user);
      })
   })
}
