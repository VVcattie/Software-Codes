
const express = require('express'); // Add the express framework has been added
let app = express();

const bodyParser = require('body-parser'); // Add the body-parser tool has been added
app.use(bodyParser.json());              // Add support for JSON encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // Add support for URL encoded bodies

const pug = require('pug'); // Add the 'pug' view engine

//Create Database Connection
const pgp = require('pg-promise')();


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
	database: 'textbuddy_database',
	user: 'postgres',
	password: 'password'
};

let db = pgp(dbConfig);

// set the view engine to ejs
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/')); // This line is necessary for us to use relative paths and access our resources directory


// below are the basic functions to render all of the pages as they are called
//this uses the .pug pages
app.get('/loginPage', function(req, res) {
	res.render('loginPage',{
		my_title:"Login Page"
	});
});
app.get('/homePage', function(req, res){
  res.render('homePage',{
    my_title:"Home Page"
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
app.get('/loginPage/checkUserLogin', function(req, res){
  var validUser = false;
	db.any('SELECT*FROM users;')
		.then(function(rows){
      console.log("Username entered" + req.query.username);
      console.log("Password entered" + req.query.password);
			for (var i=0;i < rows.length;i++){
		if (rows[i].user_username == req.query.username && rows[i].user_password == req.query.password){
			validUser = true;
		}
	 }
   if (validUser){
     console.log("login success");
     return res.redirect("/homePage");
   }
   else{
     console.log("login failure");
     return res.redirect("/loginPage");
   }
		})
		.catch(function(err){
			console.log(err);
		});
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
   }
   else{
     let insert_statement = "INSERT INTO users(user_username, user_password, user_email, user_first_name, user_last_name) VALUES('" + usernameInput + "','" + passwordInput + "','" + emailInput +"','" + firstNameInput +"','" +lastNameInput +"') ON CONFLICT DO NOTHING;";
     db.any(insert_statement)
       .then(function(){
         console.log('success added!')
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
		});
});
//function to add a new textbook or notebook listing to the database
app.post('/listings/postListing', function(req,res){
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
              console.log('error'); //if this doesn't work for you replace with console.log
      });
      res.redirect('back');
});

app.get('/forum', function(req,res){
  var callPosts = 'select * from topics';
  db.task('get-everything', task => {
        return task.batch([
            task.any(callPosts)
        ]);
    })
    .then(info => {
      res.render('forum',{
        my_title: "Forum",
        data: info[0]
      })

        console.log('post retreiveal success');
    })
  .catch(function(err){
    console.log('post retreiveal failed...');
  });

});



app.listen(3000);
console.log('website up and moving');
