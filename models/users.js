var mongoose 		= require("mongoose"),
	localMongoose 	= require("passport-local-mongoose");

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

module.exports = mongoose.model("User", userSchema);
