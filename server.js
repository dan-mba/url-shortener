'use strict';

var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
var bodyParser = require('body-parser');
var validUrl = require('valid-url');
var dns = require('dns');
var URL = require('url').URL;
var cors = require('cors');

var app = express();

var port = process.env.PORT || 3000;

/** Initialize DB **/ 
// connect to mongoDB database using mongoose. URL is in .env file for security purposes 
mongoose.connect(process.env.MONGO_URI,{useNewUrlParser:true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true});
// Initialize Mongoose auto increment plugin 
autoIncrement.initialize(mongoose.connection);


// Enable CORS Requests
app.use(cors());

// Parse POST values
app.use(bodyParser.urlencoded({extended: false}))

// Setup seving public files
app.use('/public', express.static(process.cwd() + '/public'));
// Setup home page
app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

// Setup Mongoose Schema
var Schema = mongoose.Schema;
var urlSchema = new Schema ({
  url: String
});

// Configure Mongoose auto increment plugin to manage urlId field
urlSchema.plugin(autoIncrement.plugin, {
  model: 'Url',
  field: 'urlId',
  startAt: 1
});
var Url = mongoose.model('Url', urlSchema);

var createAndSaveUrl = function(inputUrl, done){
  var url = new Url({url: inputUrl});
  url.save(function(err,data){
    if(err)  { done(err); }
    else { done(null, data); }
  });
}

var findUrl = function(inputUrl, done) {
  Url.findOne({url: inputUrl}, function(err, data){
    if(err) { done(err);}
    else { done(null,data); }
  });
}

var findUrlId = function(inputId, done) {
  Url.findOne({urlId: inputId}, function(err,data){
    if(err) { done(err);}
    else { done(null,data); }
  });
}

// POST API endpoint... 
app.post("/api/shorturl/new", function (req, res, next) {
  // Verify URL is valid format
  if (validUrl.isWebUri(req.body.url)) {
    const myURL = new URL(req.body.url);
    // Verify host is valid
    dns.lookup(myURL.hostname, 
      function(err, addr, fam) {
        if(err) {
          res.json({'error':'invalid URL'})
        } else {
          // See if URL is already in DB
          findUrl(req.body.url, function(err,data) {
            if(err) { return; }
            if (data) {
              res.json({'original_url':req.body.url, 'new_url': data.urlId});
            } else {
             createAndSaveUrl(req.body.url, function(err,data) {
               if(err) {return;}
               res.json({'original_url':req.body.url, 'new_url': data.urlId});
             }); 
            }
          });
        }
      }
    );
  } else {
    res.json({'error':'invalid URL'});
  }
});

// GET API endpoint
app.get(/\/api\/shorturl\/(.*)/, function(req, res, next) {
  var inputId = req.params[0];
  
  // If valid shorturl, redirect to site
  findUrlId(inputId, function(err, data){
    if(err){ res.json({'error': 'invalid Short URL'}); }
    else {
      res.redirect(data.url);
    }
  });
});


app.listen(port, function () {
  console.log('Node.js listening ...');
});