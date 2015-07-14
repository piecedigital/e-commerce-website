console.log("required routes module\r\n");

var app = require('express')(),
		fs = require("fs"),
		MongoClient  = require("mongodb"),
		ObjectId = require("mongodb").ObjectID;

var serverOptions = {
  "auto_reconnect": true,
  "poolSize": 5
}
// mongodb config
var Server = MongoClient.Server,
Db = MongoClient.Db,
db = new Db("basic-db", new Server("localhost", 27017, serverOptions));
var mailer = require("./mailer"),
		store = require("./store"),
		account = require("./accounts");

var User = db.collection("users"),
		Pending = db.collection("pending"),
		Profile = db.collection("profiles"),
		Sess = db.collection("sessions");
//sass compile
var sass = require('node-sass');
sass.render({
  file: "./private/sass/style.scss",
  outputStyle: "expanded",
  outFile: "./public/css/styl.css"
}, function(err, result) {
	if(err) throw err;

	//console.log(result.css.toString());
	fs.writeFile('./public/css/style.css', result.css.toString(), function (err) {
	  if (err) throw err;

	  console.log('CSS rendered and saved');
	});
});

//start db for routes
db.open(function(err, db) {
	if(err) throw err;

	// GET requests
	app
		.get('/', function(req, res, next) {
			var session = req.cookies["sessId"] || "";

			if(session) {
	      Sess.findOne({ "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
	  				res.render('index', { "page" : "home", "title" : "Hello World", "logType" : "logout", "logText" : "Logout" });
	        } else {
	        	res.clearCookie("sessId");
	  				res.render('index', { "page" : "home", "title" : "Hello World", "logType" : "login", "logText" : "Login" });
	        }
	      });
			} else {
				res.render('index', { "page" : "home", "title" : "Hello World", "logType" : "login", "logText" : "Login" });
			}
		})
		.get('/about', function(req, res, next) {
			var session = req.cookies["sessId"] || "";

			if(session) {
	      Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
	  				res.render('about', { "page" : "about", "title" : "Help", "logType" : "logout", "logText" : "Logout" });
	        } else {
	        	res.clearCookie("sessId");
	  				res.render('about', { "page" : "about", "title" : "Help", "logType" : "login", "logText" : "Login" });
	        }
	      });
			} else {
				res.render('about', { "page" : "about", "title" : "Help", "logType" : "login", "logText" : "Login" });
			}
		})
		.get("/login", function(req, res, next) {
			var session = req.cookies["sessId"] || "";

			if(session) {

	      Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
						res.render("signUpIn", { "page" : "signupin", "title" : "Sign Up/Login", "msg" :"", "sign-checked" : "", "log-checked" : "checked", "logType" : "logout", "logText" : "Logout" });
	        } else {
	        	res.clearCookie("sessId");
						res.render("signUpIn", { "page" : "signupin", "title" : "Sign Up/Login", "msg" :"", "sign-checked" : "", "log-checked" : "checked", "logType" : "login", "logText" : "Login" });
	        }
	      });
			} else {
				res.render("signUpIn", { "page" : "signupin", "title" : "Sign Up/Login", "msg" :"", "sign-checked" : "", "log-checked" : "checked", "logType" : "login", "logText" : "Login" });
			}
		})
		.get("/signup", function(req, res, next) {
			var session = req.cookies["sessId"] || "";

			if(session) {
	      Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
						res.render("signUpIn", { "page" : "signupin", "title" : "Sign Up/Login", "msg" :"", "sign-checked" : "checked", "log-checked" : "", "logType" : "logout", "logText" : "Logout" });
	        } else {
	        	res.clearCookie("sessId");
						res.render("signUpIn", { "page" : "signupin", "title" : "Sign Up/Login", "msg" :"", "sign-checked" : "checked", "log-checked" : "", "logType" : "login", "logText" : "Login" });
	        }
	      });
			} else {
				res.render("signUpIn", { "page" : "signupin", "title" : "Sign Up/Login", "msg" :"", "sign-checked" : "checked", "log-checked" : "", "logType" : "login", "logText" : "Login" });
			}
		})
		.get("/logout", function(req, res, next) {
			var session = req.cookies["sessId"] || "";

			if(session) {
				Sess.findOne({ "_id" : new ObjectId(session) }, function(err, doc) {
					if(err) throw err;

					if(doc) {
						Sess.remove({ "_id" : new ObjectId(session) });
						res.clearCookie("sessId");
						res.redirect("/");
					} else {
						res.clearCookie("sessId");
						res.redirect("/");
					}
				});
			} else {
				res.redirect("/");
			}
		})
		.get('/store', function(req, res, next) {
		  var session = req.cookies["sessId"] || "";

			if(session) {
	      Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
	  				res.render('store', { "page" : "store", "title" : "Store", "logType" : "logout", "logText" : "Logout" });
	        } else {
	        	res.clearCookie("sessId");
	  				res.render('store', { "page" : "store", "title" : "Store", "logType" : "login", "logText" : "Login" });
	        }
	      });
			} else {
				res.render('store', { "page" : "store", "title" : "Store", "logType" : "login", "logText" : "Login" });
			}
		})
		.get('/checkout', function(req, res, next) {
		  var session = req.cookies["sessId"] || "";

			if(session) {
	      Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
	  				res.render('checkout', { "page" : "checkout", "title" : "Checkout Items", "logType" : "logout", "logText" : "Logout" });
	        } else {
	        	res.clearCookie("sessId");
	  				res.render('checkout', { "page" : "checkout", "title" : "Checkout Items", "logType" : "login", "logText" : "Login" });
	        }
	      });
			} else {
				res.render('checkout', { "page" : "checkout", "title" : "Checkout Items", "logType" : "login", "logText" : "Login" });
			}
		})
		.get('/success', function(req, res, next) {
		  res.render('success', { "page" : "success", "title" : "Stripe Verdict" });
		})
		.get('/fail', function(req, res, next) {
		  res.render('fail', { "page" : "fail", "title" : "Stripe Verdict" });
		})
		.get('/upload', function(req, res, next) {
		  res.render('upload', { "page" : "upload", "title" : "Upload Test" });
		})
		.get('/mail', function(req, res, next) {
		  res.render('mail', { "page" : "mail", "title" : "Mail Test" });
		})
		.get('/profile', function(req, res, next) {
			var session = req.cookies["sessId"] || "";
			if(session) {
	      Sess.findOne({ "_id" : new ObjectId(session) }, function(err, doc) {
	        if(err) throw err;

	        if(doc) {
	          User.findOne({ "username" : doc.user }, function(err2, doc2) {
	            if(err2) throw err2;

	            if(doc2) {
	            	console.log(doc2)
		  					res.render('profile', { "page" : "profile", "title" : "Profile", "name" : doc2.usernameFull, "transactions" : doc2.transactions, "logType" : "logout", "logText" : "Logout" });

	            } else {
	        			res.redirect("/signup");
	            }
	          });
	        } else {
	        	res.clearCookie("sessId");
	        	res.redirect("/signup");
	        }
	      });
			} else {
				res.redirect("/signup");
			}
		})
		.get("/confirm", function(req, res, next) {
			var key = req.query.confirmationKey || "";

			if(key) {
				console.log(key);

				Pending.findOne({ "unlockKey" : key }, function(err, doc) {
					if(err) throw err;

					if(doc) {
						User.insert({ "email" : doc.email, "username" : doc.username, "usernameFull" : doc.usernameFull, "password" : doc.password, "points" : doc.points })
						Pending.remove({ "unlockKey" : key });

						res.render("confirm", { "status" : "success" });
					} else {
						res.render("confirm", { "status" : "fail - no pending user found" });
					}
				});
			} else {
				res.render("confirm", { "status" : "fail - no key" });
			}
		})
		.get("*", function(req, res, next) {
			res.send("Error 404: page not found");
		});

	// POST requests
	app
		//POST reqeust to add items to cart
		.post("/add-to-cart", store(db).addToCart)
		//POST reqeust to purchase items
		.post("/purchase", store(db).purchase)
	  //POST request for user signup
		.post("/signup", account(db).signup)
		//POST request for user logins
		.post("/login", account(db).login);
});	
module.exports = app;