var express=require('express');
var cookie_parser=require('cookie-parser');

var app=express();
app.use(cookie_parser());

app.get('/', function(req, res) {
  res.cookie('myFirstCookieLooksGood', 'looks Good');
  res.end("WOW");
});

app.get('/removeCookie', function(req, res) {
  res.clearcookie('myFirstCookieLooksGood');
  res.end("WOW");
});

app.listen(3000, function() {
  console.log("ya?");
});
