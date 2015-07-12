console.log("required file-handler module\r\n");

var app = require('express')(),
		MongoClient  = require("mongodb"),
		ObjectId = require("mongodb").ObjectID,
		Server = MongoClient.Server,
		Db = MongoClient.Db,
		db = new Db("basic-db", new Server("localhost", 27017));

var multer = require("multer");

var User = db.collection("users"),
		Profile = db.collection("profiles"),
		Sess = db.collection("sessions");

app.use(multer({
    dest: "./public/uploads/"
}));

app
	.post("/upload", function(req, res, next) {
		console.log(req.files.file);
		res.render("upload", { title : "Uploads", name : req.files.file.name })
	});

module.exports = app;