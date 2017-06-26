var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
	title: String,
	lowerCaseTitle: String,
	desc: String,
	isbn: String,
	googleId: String,
	price: String,
	links: {
		img: String,
		authors: String,
	},
	userId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "User"
	}
});

module.exports = mongoose.model("Book", bookSchema);