var express 		= require("express"),
	mongoose 		= require("mongoose"),
	bodyParser 		= require("body-parser"),
	passport 		= require("passport"),
	local 			= require("passport-local"),
	expSession 		= require("express-session"),
	methodOverride 	= require("method-override"),
	localMongoose 	= require("passport-local-mongoose"),
	User			= require("./models/users"),
	Book			= require("./models/books"),
	School			= require("./models/schools"),
	bookRoute		= require("./routes/books"),
	userRoute		= require("./routes/users"),
	schoolRoute		= require("./routes/schools");

mongoose.connect("mongodb://localhost/bookden");

var app = express();

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

//Routes
app.use(bookRoute);
app.use(userRoute);
// app.use(schoolRoute);

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
