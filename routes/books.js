var express 	= require("express"),
	Book 		= require("../models/books"),
	request		= require("request"),
	router 		= express.Router(),
	middleware 	= require("../middleware");

//Home route
router.get("/", function(req, res) {
	res.redirect("/books");
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

router.get("/books", function(req, res){
  if(req.query.search && req.xhr) {
      const regex = new RegExp(escapeRegex(req.query.search), 'gi');
      // Get all campgrounds from DB
      Book.find({title: regex}, function(err, books){
         if(err){
            console.log(err);
         } else {
            res.status(200).json(books);
         }
      });
  } else {
      // Get all campgrounds from DB
      Book.find({}, function(err, books){
         if(err){
             console.log(err);
         } else {
            if(req.xhr) {
              res.json(books);
            } else {
              res.render("index",{books: books});
            }
         }
      });
  }
});

// router.get("/books", function(req, res) {
// 	if(req.query.search) {
//       	const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//       	// Get all campgrounds from DB
//       	Book.find({title: regex}, function(err, books){
//         	if(err){
//             console.log(err);
//          	} else {
//             	res.status(200).json(books);
//          	}
//       	});
// 	} else {
// 		Book.find({} , function(err, books){
// 			if(err) {
// 				console.log(err);
// 			} else {
// 				res.render("index", {books: books});	//views/index.ejs
// 			}
// 		});
// 	}
// });

//Add book routes
router.get("/books/add", middleware.isLoggedIn, function(req, res) {
	res.render("books/add", {manual:false});						//views/books/add.ejs
});

router.post("/books", middleware.isLoggedIn, function(req, res) {
	Book.create(req.body.book, function(err, addedBook) {
		if(err) {
			console.log(err);
		} else {
			addedBook.lowerCaseTitle = addedBook.title.toLowerCase();
			addedBook.userId = req.user._id;
			addedBook.save();
			res.redirect("/books");
		}
	});
});

//Book Search for buying route
router.get("/b-search", function(req, res) {
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
router.get("/s-search", middleware.isLoggedIn, function(req, res) {
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
router.get("/manual", function(req, res) {
	res.render("books/add", {manual: true, book: false});
});

//Route in case user decides to use google books info
router.get("/auto/:id", function(req, res) {
	request("https://www.googleapis.com/books/v1/volumes/"+req.params.id+"?key=AIzaSyBg4timArYeoNro1FAyIAGRDMhQsstNfow", function(error, response, body) {
		if(!error && response.statusCode == 200) {
			res.render("books/add", {manual: true, book: JSON.parse(body)});
		} else {
			console.log(error);
		}
	}); 
});


//Book details route
router.get("/books/:id", function(req, res) {
	Book.findById(req.params.id, function(err, book) {
		if(err) {
			console.log(err);
		} else {
			res.render("books/details", {book: book});		//views/books/details.ejs
		}
	});
});

//Edit route
router.get("/books/:id/edit", function(req, res) {
	Book.findById(req.params.id, function(err, book) {
		if(err) {
			console.log(err);
		} else {
			res.render("books/edit", {book: book});		//views/books/edit.ejs
		}
	});
});

//Update route
router.put("/books/:id", function(req, res) {
	Book.findByIdAndUpdate(req.params.id, req.body.book, function(err, updatedBook) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/book/" + updatedBook._id)
		}
	});
});

//Delete route
router.delete("/book/:id", function(req, res) {
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

module.exports = router;