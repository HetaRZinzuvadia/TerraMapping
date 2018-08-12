var mongoose = require("mongoose");
var express = require("express");
var app = express();
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

// respond with "hello world" when a GET request is made to the homepage
app.get('/', function(req, res) {
  res.render('home');
})

// making routes for a callback
app.listen(3000, function() {
  console.log('The applicaion is working at port number.');
});
