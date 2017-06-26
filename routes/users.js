var express 	= require("express"),
	passport	= require("passport"),
	User 		= require("../models/users"),
	router 		= express.Router();
	middleware 	= require("../middleware");

//Registration routes
router.get("/register", function(req, res) {
	res.render("users/register");					//views/users/register.ejs
});

router.post("/register", function(req, res) {
	var emailEx = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
	var usernameEx = /^[a-zA-Z0-9]+([_\.]?[a-zA-Z0-9]){4,24}$/;
	if(emailEx.test(req.body.email) && usernameEx.test(req.body.username)) {
		User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, addedUser) {
			if(err) {
				console.log(err);
			} else {
				passport.authenticate("local")(req, res, function() {
					res.redirect("/books");
				});
			}
		});
	} else {
		res.redirect("/register");
	}
});

//Login Routes
router.get("/login", function(req, res) {
	res.render("users/login");					//views/users/login.ejs
});

router.post("/login", passport.authenticate("local", {
		successRedirect: "/books",
		failureRedirect: "/user/login"
}), function(req, res) {});

//Logout route
router.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/books");
});

//User profile route
router.get("/user/:id", middleware.isLoggedIn, function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if(err) {
			console.log(err);
		} else {
			res.render("users/user");	  //views/users/user.ejs
		}
	});
});

module.exports = router;