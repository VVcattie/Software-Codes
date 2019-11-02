/*login page
*/
function loginButton(){
	document.body.style.backgroundColor = 'red';
}

function validatePassword() {
	var password = document.getElementById("passwordInput").value;
	var confirmPassword = document.getElementById("confirmPasswordInput").value;
	if (password != confirmPassword) {
		alert("The password you enter doesn't match! Please try again");
		return false;
	}
	else return true;
}

//the following functions check to see if an email is valid, the first performs the check, the second will display a message
function validateEmail(email) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

function validate() {
  var $result = $("#result");
  var email = $("#email").val();
  $result.text("");

  if (validateEmail(email)) {
    $result.text(email + " is valid :)");
    $result.css("color", "green");
  } else {
    $result.text(email + " is not valid :(");
    $result.css("color", "red");
  }
  return false;
}
$("#validate").on("click", validate);
