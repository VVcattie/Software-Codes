/*login page
*/
function loginButton(){
	document.body.style.backgroundColor = 'red';
}

// function validatePassword() {
// 	var password = document.getElementById("passwordInput").value;
// 	var confirmPassword = document.getElementById("confirmPasswordInput").value;
// 	var match = document.getElementById("match");
//
// 	if (password != confirmPassword) {
// 		alert("The password you enter doesn't match! Please try again");
// 		//return false;
// 	}
// 	else {
// 		match.classList.remove("invalid");
// 		match.classList.add("valid");
// 		return true;
// 	}
// }

function loadValidationRequirements() {
	var passwordInput = document.getElementById("passwordInput");
  var confirmPasswordInput = document.getElementById("confirmPasswordInput");
	var emailInput = document.getElementById("emailInput");
	var emailMessage = document.getElementById("emailMessage");
	var letter = document.getElementById("letter");
	var capital = document.getElementById("capital");
	var number = document.getElementById("number");
	var length = document.getElementById("length");
	var match = document.getElementById("match");

  //var match = document.getElementById("match");

	emailInput.onkeyup = function() {
		var isEmailProper = false;

		var emailCheck = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		if(emailInput.value.match(emailCheck)) {
				emailMessage.innerHTML = "Valid Email";
	  } else {
				emailMessage.innerHTML = "Invalid Email";
				isEmailProper = false;
	  }
	}

	passwordInput.onkeyup = function() {
		console.log('check');

		var isPasswordProper = true;

		var lowerCaseLetters = /[a-z]/; // : Fill in the regular experssion for lowerCaseLetters
	  var upperCaseLetters = /[A-Z]/; // : Fill in the regular experssion for upperCaseLetters
	  var numbers = /[0-9]/; // : Fill in the regular experssion for digits
	  var minLength = 8;

		// Validate if there is a lowercase letter
		if(passwordInput.value.match(lowerCaseLetters)) {
	      letter.classList.remove("invalid");
	      letter.classList.add("valid");
	  } else {
	      letter.classList.remove("valid");
	      letter.classList.add("invalid");
				isPasswordProper = false;
	  }

		// Validate if there is a uppercase letter
		if(passwordInput.value.match(upperCaseLetters)) {
				 capital.classList.remove("invalid");
				 capital.classList.add("valid");
		 } else {
				 capital.classList.remove("valid");
				 capital.classList.add("invalid");
				 isPasswordProper = false;
		 }

		 // Validate there is a number
		 if(passwordInput.value.match(numbers)) {
				 number.classList.remove("invalid");
				 number.classList.add("valid");
		 } else {
				 number.classList.remove("valid");
				 number.classList.add("invalid");
				 isPasswordProper = false;
		 }

		 // Validate the length of the password
		 if(passwordInput.value.length >= minLength) {
				 length.classList.remove("invalid");
				 length.classList.add("valid");
		 } else {
				 length.classList.remove("valid");
				 length.classList.add("invalid");
				 isPasswordProper = false;
		 }
	 }

	 confirmPasswordInput.onkeyup = function(){
		 match.classList.remove("invalid");
		 match.classList.add("valid");

		 var doesPasswordMatch = false;
		 if (passwordInput.value === confirmPasswordInput.value) {
		 		match.classList.remove("invalid");
  			match.classList.add("valid");
				doesPasswordMatch = true;
 			//alert("The password you enter doesn't match! Please try again");
 			//return false;
		 }
 		 else {
 			  match.classList.remove("valid");
 			  match.classList.add("invalid");
 				doesPasswordMatch = false;
 		}
	 }
}
