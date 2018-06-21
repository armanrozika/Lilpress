let mongoose = require('mongoose');

let articleSchema = mongoose.Schema({
   title: {
      type: String,
      required: true
   },
   author: {
      type: String,
      required: false
   },
   body: {
      type: String,
      required: true
   },
   category:{
      type: String,
      required: false
   },
   draft:{
      type: String,
      required: false
   },
   date:{
      type: String,
      required: false
   },
   files:{
      type: Array,
      required: false
   }
});

let Article = module.exports = mongoose.model('Article', articleSchema);
