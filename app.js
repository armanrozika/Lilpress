
//Requiring Dependencies
let express = require('express'),
   app = express(),
   path = require('path'), //this required to define path
   bodyParser = require('body-parser'),
   mongoose = require('mongoose'),
   multer = require('multer'),
   expressValidator = require('express-validator'),
   flash = require('connect-flash'),
   session = require('express-session'),
   config = require('./config/database'),
   passport = require('passport'),
   handlebars = require('express3-handlebars').create({
      //the layout can be costumize later on with layout key, like so, layout: 'blahblah.handlebars'
      defaultLayout: 'main'
   });

//set the view engine
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');


//set port to listen to
app.set('port', process.env.PORT || 3000);

//connect to mongodb via mongoose
mongoose.connect(config.database);
let db = mongoose.connection;

db.once('open', function(){
   console.log('connected to mongo db');
});
db.on('error', function(err){
      //dont write this one
   console.log(err);
});


//article schema from models/article.js
let Article = require('./models/article')

//middleware for parsing json, not sure to use this, cause multer is used here also
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//static resource, meaning if you specify the route here, you'll get the file, do i get routes too?
//do this behave like a get request to this path??
app.use(express.static(path.join(__dirname, 'static')));

//middleware of flash anc connect flash, handling session
app.use(session({
   secret: 'keyboard',
   resave: true,
   saveUninitialized: true
}));

app.use(flash());

//express messages, still not get what it is doing with flash, learn it soon !
app.use(function(req, res, next){
   res.locals.messages = require('express-messages')(req, res);
   next();
});

//this is to validate smoe errors in form, still dont get it too !
app.use(expressValidator({
   errorFormatter: function(param, msg, value){
      let namespace = param.split('.'),
         root = namespace.shift(),
         formParam = root;

         while(namespace.length){
            formParam+= '[' + namespace.shift() + ']';
         }
         return {
            param: formParam,
            msg: msg,
            value: value
         };
   }
}));

//pasport config, for user authentication, middleware too, and still dont get it,
//shit, i dont get it how middleware work
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());



//Now, this is the request, and what response my server will do depending on that request
app.get('/', function(req, res){
   Article.find({}, function(err, articles){
      //console.log(articles)
      if(err){
         console.log(err);
      }else{
         res.render('home', {
            layout: 'main.handlebars',
            articles: articles
         })
      }
   })
})


//this is to prevent a get request to dashboard if not login, a middleware too
function authentication(req, res, next){
   if(req.isAuthenticated()){
      return next();
   }else{
      req.flash('danger', 'Please login');
      res.redirect('/user/login');
   }
}

//the get routes handler
app.get('/newpost', authentication, function(req, res){
   res.render('newpost', {
      layout:'main.handlebars',
      messages: require('express-messages')(req, res)()
   });
});

app.get('/dashboard', authentication, function(req, res){
   Article.find({}, function(err, articles){
      //console.log(articles)
      if(err){
         console.log(err);
      }else{
         res.render('dashboard', {
            layout: 'main.handlebars',
            articles: articles
         });
      }
   })
});



//using multer middleware to handle multipart/form-data, such as files and images, work with json too
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


//the post request, and response with my server
app.post('/newpost', upload, function(req, res, next){
   //console.log(req.files);
   //console.log(req.body);
   req.checkBody('title', 'Title required').notEmpty();
   req.checkBody('myDoc', 'Body required').notEmpty();

   let errors = req.validationErrors();

   if(errors){
      res.render('newpost', {
         errors: errors
      })
   }else{
      let article = new Article();
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
   //console.log(article.body);
   //console.log(i);

      article.save(function(err){
         if(err){
            console.log(err);
            return;
         }else{
            req.flash('success', 'Article added');
            res.redirect('/newpost');
            //console.log(res.locals.messages);
            //console.log(req.flash);
         }
      })
   }

})



   // let today = new Date();
   // let myDate = today.getDate();
   // let myMonth = today.getMonth();
   // let myYear = today.getFullYear();
   // let getDate = myDate + '-' + myMonth + '-' + myYear;

   // article.date = new Date();







//define routes for each request, routes for /articles goes to ./routes article and so on
//getting half understanding of this !
//it needs to require it
let router = require('./routes/articles');
let user = require('./routes/user');

//pay attention to this
app.use('/article', router);
app.use('/user', user);


//port to listen to (localhost: 3000)
app.listen(3000, function(err){
   if(err){
      console.log(err);
   }else{
      console.log('listening on port: 3000')
   }
});
