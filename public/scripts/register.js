var pass, repass, email;
var emailEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
var usernameEx = /^[a-zA-Z0-9]+([_\.]?[a-zA-Z0-9]){4,24}$/;

function formError(element) {
	element.toggleClass("has-error");
	if(element.hasClass("has-error")) {
		$("input[type='submit']").attr("disabled", "disabled");
	} else {
		$("input[type='submit']").removeAttr("disabled");
	}
}

$("input").keyup(function() {			
	pass = $("input[name='password']").val();
	cpass = $("input[name='cpassword']").val();
	email = $("input[name='email']").val();
	usrnm = $("input[name='username']").val();

	if(!usernameEx.test(usrnm) && usrnm!="") {
		if(!($("#username").hasClass("has-error"))) {
			formError($("#username")); 
		}
	} else {
		if($("#username").hasClass("has-error")) {
			formError($("#username"));
		}
	}

	if(!emailEx.test(email) && email!="") {
		if(!($("#email").hasClass("has-error"))) {
			formError($("#email")); 
		}
	} else {
		if($("#email").hasClass("has-error")) {
			formError($("#email"));
		}
	}

	if(pass != cpass && cpass!="") {
		if(!($("#pass").hasClass("has-error"))) {
			formError($("#pass")); 
			formError($("#cpass")); 
		}
	} else {
		if($("#pass").hasClass("has-error")) {
			formError($("#pass"));
			formError($("#cpass"));
		}
}
});