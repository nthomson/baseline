/*********
This will do simple regex-based validation, I may decide later to do a server-querying based validation(for usernames and the like).

This is a simple script that makes it easy to add new patterns and validation types, right now it only includes email, url, and non-blank.

Your HTML structure should look like this:
<input id="urlInput" type="text" class="validate" validType="url" /><span id="urlInput-error"></span>

An id, class, and validType are all required on the input, its also required that the error output have an id of the form: [input's id]-error
*******/

//This is an array to handle the types of validations
var validations;

window.onload=function(){
	//To add a new validation type, use the pattern below, or see the examples
	//validations['validType'] = ['pattern','error text'];
	validations = new Array();
	validations['email'] = ['.@.', 'Your email must be of the form: you@example.com'];
	//TODO: Better url regex
	validations['url'] = ['((https?):((//)|(\\\\))+[\w\d:#@%/;$()~_?\+-=\\\.&]*)', 'Your URL must be of the form: http://example.com'];
	validations['nonblank'] = ['.', 'This field cannot be blank'];
	
	//Find all inputs needed to be validated, and add proper elements/listeners
	//listener example: someElement.onkeydown = keyHandler;
	var inputs = document.getElementsByClassName('validate');
	
	for(var i = 0; i < inputs.length; i++) {
		inputs[i].onkeydown = keyHandler;
	}
}

//Runs validation on all inputs that need to be validated
function checkAll() {
	var clear = true;
	var inputs = document.getElementsByClassName('validate');
	
	for(var i = 0; i < inputs.length; i++) {
		if(!validationHandler(inputs[i])) {
			clear = false;
		}
	}
	return clear;
}

//Does the given input match the regex pattern?
function isValid(input, pattern) {
	return input.value.match(pattern);
}

//Determine which validation to use, do it, give back error text or checkmark
function validationHandler(input) {
	if(isValid(input, validations[input.getAttribute('validType')][0])) {
		//Yay valid!
		document.getElementById(input.id+"-error").innerHTML = "<img src='img/check.png' />";
		return true;
	}
	else {
		//Boo, not valid
		document.getElementById(input.id+"-error").innerHTML = validations[input.getAttribute('validType')][1];
		return false;
	}
}

//Called every time a key is pressed, we add a timeout so that we only validate 500 milliseconds after the last key is pressed
function keyHandler() {
	var input = this;
	
	//Add the "loading" graphic to the error output for this form
	document.getElementById(input.id+"-error").innerHTML = "<img src='img/loading.gif' />";
	if (input.getAttribute(input.id+"timeout")) {
		window.clearTimeout(input.getAttribute(input.id+"timeout"));
	}

	//Run the validation if no keys have been pressed in half a second
	input.setAttribute(input.id+"timeout", window.setTimeout(function () { validationHandler(input) }, 500));

	return true;
}
