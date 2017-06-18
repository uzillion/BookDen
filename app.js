var express 		= require("express"),
	mongoose 		= require("mongoose"),
	bodyParser 		= require("body-parser"),
	passport 		= require("passport"),
	local 			= require("passport-local"),
	expSession 		= require("express-session"),
	methodOverride 	= require("method-override"),
	localMongoose 	= require("passport-local-mongoose"),
	request			= require("request");

mongoose.connect("mongodb://localhost/bookden");

var app = express();


var userSchema = new mongoose.Schema({
	username: String,
	email: String,
	password: String,
	bookId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book"
	}]
});

//Adding passport.js functionalities to User
userSchema.plugin(localMongoose);

var User = mongoose.model("User", userSchema);

var bookSchema = new mongoose.Schema({
	title: String,
	desc: String,
	isbn: String,
	googleId: String,
	price: String,
	userId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}]
});

var Book = mongoose.model("Book", bookSchema);


app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended: true}));
app.use(expSession({
	secret: "Weed",
	resave: false,
	saveUninitialized: false
}));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
app.use(function(req, res, next) {
	res.locals.user = req.user;
	next();
});
app.use(methodOverride("_method"));
passport.use(new local(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
	if(req.isAuthenticated())
		return next();
	else
		res.redirect("/login");
}

//===============
// Books Routes
//===============
//Home route
app.get("/", function(req, res) {
	res.redirect("/books");
});

app.get("/books", function(req, res) {
	Book.find({}, function(err, books){
		if(err) {
			console.log(err);
		} else {
			res.render("index", {books: books});	//views/index.ejs
		}
	});
});

//Add book routes
app.get("/books/add", function(req, res) {
	res.render("books/add", {manual:false});						//views/books/add.ejs
});

app.post("/books", function(req, res) {
	Book.create(req.body.book, function(err, addedBook) {
		if(err) {
			console.log(err);
		} else {
			if(req.isAuthenticated()) {
				addedBook.userId.push(req.user._id);
				addedBook.save();
			}
			res.redirect("/books/" + addedBook._id);
		}
	});
});

//Book Search for buying route
app.get("/b-search", function(req, res) {
	var temp = req.query.bSearch;
	request("https://www.googleapis.com/books/v1/volumes?q="+temp+"&key=AIzaSyBg4timArYeoNro1FAyIAGRDMhQsstNfow", function(error, response, body) {
		if(!error && response.statusCode == 200) {
			res.render("books/b_search", {results: JSON.parse(body)});
		} else {
			console.log(error);
		}
	}); 
});

//Book search for selling route
app.get("/s-search", function(req, res) {
	var temp = req.query.sSearch;
	request("https://www.googleapis.com/books/v1/volumes?q="+temp+"&key=AIzaSyBg4timArYeoNro1FAyIAGRDMhQsstNfow", function(error, response, body) {
		if(!error && response.statusCode == 200) {
			res.render("books/s_search", {books: JSON.parse(body)});
		} else {
			console.log(error);
		}
	}); 
});

//Route in case user decides to enter things manually
app.get("/manual", function(req, res) {
	res.render("books/add", {manual: true, book: false});
});

//Route in case user decides to use google books info
app.get("/auto/:id", function(req, res) {
	request("https://www.googleapis.com/books/v1/volumes/"+req.params.id+"?key=AIzaSyBg4timArYeoNro1FAyIAGRDMhQsstNfow", function(error, response, body) {
		if(!error && response.statusCode == 200) {
			res.render("books/add", {manual: true, book: JSON.parse(body)});
		} else {
			console.log(error);
		}
	}); 
});


//Book details route
app.get("/books/:id", function(req, res) {
	Book.findById(req.params.id, function(err, book) {
		if(err) {
			console.log(err);
		} else {
			res.render("books/details", {book: book});		//views/books/details.ejs
		}
	});
});

//Edit route
app.get("/books/:id/edit", function(req, res) {
	Book.findById(req.params.id, function(err, book) {
		if(err) {
			console.log(err);
		} else {
			res.render("books/edit", {book: book});		//views/books/edit.ejs
		}
	});
});

//Update route
app.put("/books/:id", function(req, res) {
	Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/book/" + updatedBook._id)
		}
	});
});

//Delete route
app.delete("/book/:id", function(req, res) {
	Book.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			console.log(err);
		} else {
			if(req.isAuthenticated()) {
				res.redirect("/user/" + req.user._id);
			} else {
				res.redirect("/books");
			}
		}
	});
});


//==============
// User Routes
//==============
//Registration routes
app.get("/register", function(req, res) {
	res.render("users/register");					//views/users/register.ejs
});

app.post("/register", function(req, res) {
	User.register(new User({username: req.body.username, email: req.body.email}), req.body.password, function(err, addedUser) {
		if(err) {
			console.log(err);
		} else {
			passport.authenticate("local")(req, res, function() {
				res.redirect("/books");
			});
		}
	});
});

//Login Routes
app.get("/login", function(req, res) {
	res.render("users/login");					//views/users/login.ejs
});

app.post("/login", passport.authenticate("local", {
		successRedirect: "/books",
		failureRedirect: "/user/login"
}), function(req, res) {});

//Logout route
app.get("/logout", function(req, res) {
	req.logout();
	res.redirect("/books");
});

//User profile route
app.get("/user/:id", isLoggedIn, function(req, res) {
	User.findById(req.params.id, function(err, user) {
		if(err) {
			console.log(err);
		} else {
			res.render("users/user");	  //views/users/user.ejs
		}
	});
});


//============
//Dev Routes
//============
app.get("/drop", function(req, res) {
	Book.remove({}, function(err) { 
   		console.log("Books removed"); 
	});
	User.remove({}, function(err) { 
   		console.log("Users removed") 
	});
	res.redirect("/books");
});

//=====================
//Listening Protocols
//=====================
app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log("BookDen server started.....");
});
