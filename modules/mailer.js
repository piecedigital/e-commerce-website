console.log("required mailer module\r\n");

var app = require('express')(),
		nodemailer  = require("nodemailer"),
		smtpTransport  = require("nodemailer-smtp-transport"),
		fs  = require("fs");/*,
		MongoClient  = require("mongodb"),
		ObjectId = require("mongodb").ObjectID;
		*/
/*
var	Server = MongoClient.Server,
		Db = MongoClient.Db,
		db = new Db("basic-db", new Server("localhost", 27017));
*/
/*
var User = db.collection("users"),
		Profile = db.collection("profiles"),
		Sess = db.collection("sessions");
*/
//commented code will be uncommented when they see use.

var transporter = nodemailer.createTransport(smtpTransport({
	host: "smtp.mandrillapp.com",
	port: 587,
	auth: {
		user: "piecedigitalstudios@gmail.com",
		pass: "Mm-qP4gRtGxbda4aBYLDVg"
	}
}));

module.exports = function(email, username, message) {
	return {
		mailPost: function() {
			//function to capture and format data to me mailed
			var messageDetails = {
				title: "Confirm your email",
				subject: username + ", confirm your account email",
				body: message,
				email: email
			}
			fs.readFile("./modules/mail-templates/template1.html", {
				encoding: "UTF-8"
			}, function(err, data) {
				if(err) throw err;

				//console.log(data);
				sendMail(data, messageDetails);
			});

			console.log("gotten");
		}
	};
}

//function to actually send the email
function sendMail(data, details) {
	data = data.replace(/[{]{2}title[}]{2}/gi, details.title)
			.replace(/[{]{2}body[}]{2}/gi, details.body);
	//console.log(data);

	transporter.sendMail({
		sender: "piecedigitalstudios@gmail.com",
		from: {
			name: "Darryl Dixon",
			address: "piecedigitalstudios@gmail.com"
		},
		to: details.email,
		replyTo: "piecedigitalstudios@gmail.com",
		subject: details.subject,
		html: data
	}, function(err, info) {
		if(err) {
			console.log("Mailing error: " + err);
		}
		console.log("Message - messageId: " + info.messageId);
		console.log("Message - envelope: " + JSON.stringify(info.envelope));
		console.log("Message - accepted: " + info.accepted);
		console.log("Message - rejected: " + info.rejected);
		console.log("Message - pending: " + info.pending);
		console.log("Message - response: " + info.response);
	});
}
