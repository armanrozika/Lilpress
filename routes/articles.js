let express = require('express'),
   router = express.Router(),
   multer = require('multer');

let Article = require('../models/article');



   let uploadMul = multer({dest: './static/img'});

   let storage = multer.diskStorage({
      destination: './static/img/',
      filename: function(req, file, callback){
         callback(null, file.originalname + '-' + Date.now() + path.extname(file.originalname) );
      }
   });

   let upload = multer({
      storage: storage
   }).array('myImage', 4);




   router.get('/:title', function(req, res){
      let par = req.params.title;
      Article.find({title: par}, function(err, articles){
         if(err){
            console.log(err)
         }else{
            res.render('read', {
               layout:'main.handlebars',
               articles: articles[0]
            });
         }
      });
   });



   router.get('/edit/:title', authentication, function(req, res){
      Article.find({title: req.params.title}, function(err, articles){
      //console.log(article[0].files[0].filename);
         if(err){
            console.log(err)
         }else{
            res.render('edit', {
               layout:'main.handlebars',
               articles: articles[0]
            });
         }
      });
   });


//Routes For Categories
   router.get('/category/webdev', function(req, res){
      Article.find({category: "webdev"}, function(err, articles){
      console.log(articles[0]);
         if(err){
            console.log(err)
         }else{
            res.render('home', {
               layout:'main.handlebars',
               articles: articles
            });
         }
      });
   });

   router.get('/category/javascript', function(req, res){
      Article.find({category: "javascript"}, function(err, articles){
      console.log(articles[0]);
         if(err){
            console.log(err)
         }else{
            res.render('home', {
               layout:'main.handlebars',
               articles: articles
            });
         }
      });
   });

   router.post('/edit/:title', upload, function(req, res, next){
      let article = {};
      article.title = req.body.title;
      article.draft = req.body.draft;
      article.body = req.body.myDoc;
      article.body = article.body.replace(/<br>/g, "");
      let i=0;
      article.body = article.body.replace(/test.com/g, function(){
         i++;
         return req.files[i-1].filename;

      });
      article.files = req.files;

      article.category = req.body.category;
      article.date = new Date();
      let query = {title: req.params.title}

      Article.update(query, article, function(err){
         if(err){
            console.log(err);
            return;
         }else{
            req.flash('success', 'Article updated');
            res.redirect('/newpost');
         }
      })
   })


   router.delete('/:title', function(req, res){
      let query = {title: req.params.title};
      Article.remove(query, function(err){
         if(err){
            console.log(err);
         }
         res.send("success");
      })
   });

function authentication(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }else{
      req.flash('danger', 'Please login');
      res.redirect('/user/login');
   }
}


module.exports = router;
