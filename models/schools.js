var mongoose = require("mongoose");

var schoolSchema = new mongoose.Schema({
	zip: Number,
	name: String,
	bookId: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "Book"
	}]
});

module.exports = mongoose.model("School", schoolSchema);