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
