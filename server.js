
const express = require('express'); // Add the express framework has been added
let app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const pug = require('pug'); // Add the 'pug' view engine

//Create Database Connection
const pgp = require('pg-promise')();

var cookieParser = require('cookie-parser');
var session = require('express-session');

/**********************
  Database Connection information
  host: This defines the ip address of the server hosting our database.  We'll be using localhost and run our database on our local machine (i.e. can't be access via the Internet)
  port: This defines what port we can expect to communicate to our database.  We'll use 5432 to talk with PostgreSQL
  database: This is the name of our specific database.  From our previous lab, we created the football_db database, which holds our football data tables
  user: This should be left as postgres, the default user account created when PostgreSQL was installed
  password: This the password for accessing the database.  You'll need to set a password USING THE PSQL TERMINAL THIS IS NOT A PASSWORD FOR POSTGRES USER ACCOUNT IN LINUX!
  **********************/
// REMEMBER to chage the password

const dbConfig = {
	host: 'localhost',
	port: 5432,
	database: 'textbuddy_database',  //name of database (CHANGE accordingly)
	user: 'postgres',
	password: 'password'
};

let db = pgp(dbConfig);

// set the view engine to pug
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory
app.use(cookieParser());

app.use(session({
    key: 'usersid', //name of cookie
    secret: 'sreesha193',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000 //max age of cookie is 10 minutes
      }
    }));

//automatically log user out if session user is not set but user session cookie is stil set
app.use((req, res, next) => {
  if(req.cookies)
  {
    if(!req.session.user && req.cookies.usersid)
    {
      res.clearCookie('usersid');
    }
  }
  next();
});

// below are the basic functions to render all of the pages as they are called
//this uses the .pug pages
app.get('/loginPage', function(req, res) {

  //checks if user is logged in or not and directs them to the corresponding page
  var logged_in = false;
  if(req.cookies) {
    if(req.session.user && req.cookies.usersid) {
      logged_in = true;
    }
  }
  console.log("Logged in: " + logged_in);

  if(logged_in) {
    res.render('homePage',{
      my_title:"Home Page",
      loggedIn: logged_in
    });
  } else {
    res.render('loginPage',{
      my_title:"Login Page",
      loggedIn: logged_in
    });
  }

});

app.get('/homePage', function(req, res){
  //checks if user is logged in or not and directs them to the corresponding page
  var logged_in = false;
  if(req.cookies) {
    if(req.session.user && req.cookies.usersid) {
      logged_in = true;
    }
  }
  console.log("Logged in: " + logged_in);

  res.render('homePage',{
    my_title:"Home Page",
    loggedIn: logged_in
  });
});

app.get('/signUp', function(req, res){
  res.render('signUp',{
    my_title:"Sign Up"
  });
});

app.get('/paymentPage', function(req, res){
  res.render('paymentPage',{
    my_title:"Payment Info"
  });
});

//function to see if the account exists
app.post('/loginPage/checkUserLogin', function(req, res){
  var validUser = false;
  var username = req.body.username;
  var password = req.body.password;
  db.any('SELECT*FROM users;')
  .then(function(rows){
    console.log("Username entered" + username);
    console.log("Password entered" + password);
    for (var i=0;i < rows.length;i++){
      if (rows[i].user_username == username && rows[i].user_password == password){
       validUser = true;
     }
   }
   if(validUser){ //login success
     console.log("Login success for user " + username + "...");
     req.session.user = username; //user session is the same as username
     return res.redirect("/homePage");
   }
   else{  //failed to login
     console.log("Login failure!");
     return res.redirect("/loginPage");
   }
 })
  .catch(function(err){
   console.log(err);
 });
});

app.get('/logout', function(req, res) {
  if(req.cookies) {
    if(req.session.user && req.cookies.usersid) { //user is logged in
      res.clearCookie('usersid'); //logout user
    }
  }
  res.redirect('/loginPage');
});

//function to post a new account to the database
app.post('/signUp/createAccount', function(req,res){
  var firstNameInput = req.body.firstNameInput;
  var lastNameInput = req.body.LastNameInput;
  var usernameInput = req.body.usernameInput;
  var passwordInput = req.body.passwordInput;
  var emailInput = req.body.emailInput;
  var validUser = false;

  db.any('SELECT*FROM users;')
  .then(function(rows){
    console.log("Username entered" + usernameInput);
    console.log("Password entered" + passwordInput);
    for (var i=0;i < rows.length;i++){
      if (rows[i].user_username == usernameInput || rows[i].user_email == emailInput){
        validUser = true;
      }
    }
    if (validUser){
     console.log("account already exists");
     res.redirect("/signUp");
   }
   else{
     let insert_statement = "INSERT INTO users(user_username, user_password, user_email, user_first_name, user_last_name) VALUES('" + usernameInput + "','" + passwordInput + "','" + emailInput +"','" + firstNameInput +"','" +lastNameInput +"') ON CONFLICT DO NOTHING;";
     db.any(insert_statement)
     .then(function(){
       console.log('success added!')
       res.redirect("/loginPage");
     })
     .catch(function(err){
       console.log(err);
     });
   }
 })
  .catch(function(err){
    console.log(err);
  });
    /*
    // TODO:
    create function that has a pop up that informs the user that the email/username already exists in the database, tells them to use something else
    */
    //if the usercheck returned no users, create the account
  });
//function to render the listings of textbooks from the database
app.get('/listings', function(req, res){
    //check to see if there is a selection, then do the db calls

    var callListings = "select * from listings;";
    var listingUser = "select user_username from users right join listings on listing_email = user_email;";
    db.task('get-everything', task => {
      return task.batch([
        task.any(callListings),
        task.any(listingUser)
        ]);
    })
    .then(info => {
      res.render('listings',{
        my_title: "Listings",
        test: info[0],
        listingUsername: info[1]
      })

      console.log('listings retreiveal success');
    })
    .catch(function(err){
     console.log('listings retreiveal failed...');
     	res.render('listings',{
        my_title: "Listings",
        test: "",
        listingUsername: ""
      })
   });
  });
//function to add a new textbook or notebook listing to the database
app.post('/listings/postListing', function(req,res){
  if (!req.session.user || !req.cookies.usersid){ //if user isnt logged in, they cant post a topic
    res.redirect('/loginPage');
  }
  else{
    var title = req.body.title;
    var category = req.body.post_class;
    var description = req.body.subject;
    var price = req.body.price;
    var username = req.body.sellerName;
    var email = req.body.sellerEmail;
    var bookType = req.body.optradio;
    console.log("email: " + email);
    console.log("title: " + title);
    console.log("category: " + category);
    console.log("description: " + description);
    console.log("bookType: " + bookType);
    console.log("Price: " + price);
    console.log("username: " + username);
    var getUserID = "select * from users where user_email = '" + email + "';";
    var userID;
    db.any(getUserID)
    .then(function(rows){
      userID = rows[0].user_username;
      console.log("userID: " +userID);
    });
        //todo fix username entry
        var insertStatement = "INSERT INTO listings(listing_title, listing_username, listing_description, listing_subject, listing_booktype, listing_price, listing_email) VALUES('"+ title + "','" + userID + "', '" + description + "','" + category + "'," + bookType + ","+price+",'"+email+"') ON CONFLICT DO NOTHING;";
        db.any(insertStatement)
        .then(function(){
          console.log('success added!')
        })
        .catch(error => {
            // display error message in case an error
                console.log(error); //if this doesn't work for you replace with console.log
              });
        res.redirect('back');
    }
});

app.post('/listings/searchListings', function(req,res){
  var title = req.body.title;
  var category = req.body.myList;
  var bookType = req.body.optradio;
  console.log("title: " + title);
  console.log("category: " + category);
  console.log("bookType: " + bookType);

  if (bookType == undefined){
    bookType = 2;
  }
  //todo fix username entry
  var queryFilter = "SELECT * from listings WHERE (listing_title ~* '" + title + "') AND (listing_subject = '" + category + "') AND (listing_booktype = " + bookType + ");";
  //var callListings = "select * from listings;";
  var listingUser = "select user_username from users right join listings on listing_email = user_email;";
  db.task('get-everything', task => {
    return task.batch([
      task.any(queryFilter),
      task.any(listingUser)
      ]);
  })

  .then(info => {
    res.render('listings',{
      my_title: "Listings",
      test: info[0],
      listingUsername: info[1]
    })

    console.log('listings retreiveal success');
  })

  .catch(function(err){
   console.log('listings retreiveal failed...');
  });
});

app.get('/forum', function(req,res){
  var listSelection = req.body.listSubject;
  if (listSelection){
    var callPosts = 'select * from topics where topic_subject = '+ listSelection;
  }
  else{
    var callPosts = 'select * from topics;';
  }
  var callReplies = 'select * from replies;';

  db.task('get-everything', task => {
    return task.batch([
      task.any(callPosts),
      task.any(callReplies)
      ]);
  })
  .then(info => {
    res.render('forum',{
      my_title: "Forum",
      topics: info[0],
      replies: info[1]
    })

    console.log('post retreiveal success');
  })
  .catch(function(err){
    console.log('post retreiveal failed...');
  });

});
app.post('/forum/postTopic', function(req,res){

  if (!req.session.user || !req.cookies.usersid){ //if user isnt logged in, they cant post a topic
    res.redirect('/loginPage');
  }
  else{
    var title = req.body.title;
    var subject = req.body.post_class;
    var textBody = req.body.subject;
    var insertStatement = "INSERT INTO topics(topic_title, topic_subject, topic_username, Topic_body) VALUES('"+ title +"','"+ subject+"','"+ req.session.user +"','"+ textBody +"') ON CONFLICT DO NOTHING;";
    console.log(insertStatement);
    db.any(insertStatement).then(function(){
      console.log('success added!')
    })
    .catch(error => {
        // display error message in case an error
            console.log('error'); //if this doesn't work for you replace with console.log
          });
    res.redirect('back');
  }
});
app.post('/forum/postReply', function(req,res){
  if (!req.session.user || !req.cookies.usersid){ //if user isnt logged in, they cant post a topic
    res.redirect('/loginPage');
  }
  else{
    var replyID = req.query.id;
    var replyBody = req.body['postReply'+ replyID];
    console.log(replyBody);

    var insertStatement = "insert into replies(reply_topic_id, reply_username, reply_body) values("+replyID+",'" +req.session.user+"','"+req.body['postReply'+req.query.id]+"');";
    console.log(insertStatement);
    db.any(insertStatement).then(function(){
      console.log('success added!')
    })
    .catch(error => {
        // display error message in case an error
            console.log(error); //if this doesn't work for you replace with console.log
          });
    res.redirect('back');
  }

});


app.listen(3000);
console.log('TextBuddy up and moving');
