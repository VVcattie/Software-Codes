
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


// login page
app.get('/loginPage', function(req, res) {
	res.render('loginPage',{
		my_title:"Login Page"
	});
});
app.get('/homePage', function(req, res){
  res.render('loginPage',{
    my_title:"Home Page"
  });
});
app.get('/signUp', function(req, res){
  res.render('signUp',{
    my_title:"Sign Up"
  });
});
app.get('/loginPage/checkUserLogin', function(req, res){
	db.any('SELECT*FROM users;')
		.then(function(rows){
			for (var i=0;i < rows.length;i++){
		if (rows[i].user_username == req.query.username && rows[i].user_password == req.query.password){
			console.log("login success");
		}
		else{
			console.log("failed")
		}
	}
		})
		.catch(function(err){
			console.log(err);
		});
});

app.post('/signUp/createAccount', function(req,res) {
  var firstNameInput = req.body.firstNameInput;
  var lastNameInput = req.body.LastNameInput;
  var usernameInput = req.body.usernameInput;
  var passwordInput = req.body.passwordInput;
  var emailInput = req.body.emailInput;
  // var createUser = {
  // 	user_username: req.body.usernameInput,
  // 	user_password: req.body.passwordInput,
  // 	user_email: req.body.emailInput,
  // 	user_first_name: req.body.firstNameInput,
  // 	user_last_name: req.body.lastNameInput
  // }
	let insert_statement = "INSERT INTO users(user_username, user_password, user_email, user_first_name, user_last_name) VALUES('" + usernameInput + "','" + passwordInput + "','" + emailInput +"','" + firstNameInput +"','" +lastNameInput +"') ON CONFLICT DO NOTHING;";
	db.any(insert_statement)
		.then(function(){
			console.log('success added!')
		})
		.catch(function(err){
			console.log(err);
		});

    // .then(info => {
    // 	res.render('pages/home',{
		// 		my_title: "Home Page",
		// 		data: info[1],
		// 		color: color_hex,
		// 		color_msg: color_message
		// 	})
    // })
    // .catch(error => {
    //     // display error message in case an error
    //         console.log('error'); //if this doesn't work for you replace with console.log
    //         res.render('signUp', {
    //             title: 'Sign Up',
    //             data: '',
    //             color: '',
    //             color_msg: ''
    //         })
    // });

});



app.listen(3000);
console.log('website up and moving');