var express=require('express');
var cookie_parser=require('cookie-parser');
var session=require('express-session');

var app=express();
app.use(cookie_parser());
// cookie max age is 10 min
app.use(session({secret:"sreesha19", resave:false, saveUnitialized:true, cookie: {maxAge: 600000}}));


//possible code
if()