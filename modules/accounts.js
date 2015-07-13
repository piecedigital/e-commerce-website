console.log("required store module\r\n");

var app = require('express')(),
bcrypt = require("bcryptjs");

// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
module.exports = function(db) {
  var User = db.collection("users"),
      Profile = db.collection("profiles"),
      Sess = db.collection("sessions");
  return {
    signup: function(req, res, next) {
      //sets up variables that's be used
      var email = req.body.email.toLowerCase() || "",
          username = req.body.username.toLowerCase() || "",
          usernameFull = req.body.username || "",
          password = req.body.password || "",
          passwordConf = req.body.passwordconfirm || "";
      //check whether the user submitted the form with all parameters. if not
      //then the alternative is to re-render the page with the appropriate message
      //explaining why
      if(email && username && password && passwordConf) {
        //checks for valid email
        if( email && email.match(/([a-z0-9])*([.][a-z0-9]*)?([@][a-z0-9]*[.][a-z]{1,3})([.][a-z]{1,2})?/i) ) {
          if(password === passwordConf) {
            //opens the data base to be queried
            //attemps to find a user with the given username
            Pending.findOne({ "$or" : [ { "email" : email }, { "username" : username } ] }, function(err, doc) {
              if(err) throw err;

              if(!doc) {
                User.findOne({ "email" : email }, function(err2, doc2) {
                  if(err2) throw err2;

                  if(!doc2) {
                    User.findOne({ "username" : username }, function(err3, doc3) {
                      if(err3) throw err3;

                      //if there is no doc returned then the username is not taken, the next actions proveed.
                      //if there is a doc returned then there the username is taken
                      //and the page is re-rendered with the message telling the user it's taken
                      if(!doc3) {
                        //regCheck is a Regular Expression check for unwanted characters
                        //in the username. if they don't exist then the next operation
                        // continues. if they do exist then the user is notified
                        var regCheck = username.match(/[\\~`!@#\$%\^&\*()+=|\/\.,<>]/gi);
                        if(!regCheck) {
                          //generates a random salt number between 0 and 10
                          var salt = Math.round( (Math.random() + 4) + (Math.round(Math.random() * 6)) );
                          salt = (salt < 4) ? 4 : salt;
                          console.log("salt: " + salt);
                          //this is where the password is hashed with one of 4-10 salts
                          bcrypt.hash(password, salt, function(hashErr, hash) {
                            if(hashErr) throw hashErr;

                            makeKey(hash);
                          });
                          //makes a random confimration key for the user to validate their account creation
                          function makeKey(hash) {
                            var keyLibrary = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_-0123456789".split(""),
                                count = 10 + (Math.round(Math.random() * 2)),
                                itter = 1,
                                key = "";

                            while(itter <= count) {
                              itter++;
                              key += keyLibrary[Math.round(Math.random() * (keyLibrary.length - 1))];
                            }
                            Pending.findOne({ "unlockKey" : key }, function(pendErr, pendDoc) {
                              if(pendErr) throw pendErr;

                              if(!pendDoc) {
                                insertPending(key, hash);
                              } else {
                                makeKey();
                              }
                            });
                          }
                          //inserts the user into the database and then sends them an email to confirm
                          function insertPending(key, hash) {
                            Pending.insert({ "unlockKey" : key, "email" : email, "username" : username, "usernameFull" : usernameFull, "password" : hash, "points" : 0, "time" : new Date().getTime() }, function(insertErr, insertedDoc) {
                              if(insertErr) throw insertErr;

                              var message = "Hello, " + usernameFull + ", to confirm your account and complete your sign up please click this link: <br>http://localhost:8081/confirm?confirmationKey=" + key;

                              mailer(email, usernameFull, message).mailPost();

                              res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Please check your email to confirm your account", "sign-checked" : "", "log-checked" : "checked" });
                            });
                          }
                        } else {
                          //error message to the user if there are illegal characters in
                          //their desired username
                          res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Illegal characters in your username: " + regCheck.join(" "), "sign-checked" : "checked", "log-checked" : "" });
                        }
                      } else {
                        //error message to the user if their desired username is taken
                        res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Username is already taken", "sign-checked" : "checked", "log-checked" : "" });
                      }
                    });
                  } else {
                    res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Email is already registered", "sign-checked" : "checked", "log-checked" : "" });
                  }
                });
              } else {
                res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Email or username already reserved", "sign-checked" : "checked", "log-checked" : "" });
              }
            });
          } else {
            res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Passwords to not match", "sign-checked" : "checked", "log-checked" : "" });
          }
        } else {
          res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "invalid email", "sign-checked" : "checked", "log-checked" : "" });
        }
      } else {
        //error message to the user if they don't submit the data in full
        res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Please fill out the form", "sign-checked" : "checked", "log-checked" : "" });
      }
    },
    login: function(req, res, next) {
      //sets up variables that's be used
      var username = req.body.username.toLowerCase() || "",
          usernameFull = req.body.username || "",
          password = req.body.password || "",
          session = req.cookies["sessId"] || "";
      //check whether the user submitted the form with all parameters. if not
      //then the alternative is to re-render the page with the appropriate message
      //explaining why
      if(username && password) {
        console.log("username and password present");
        if(!session) {
          console.log("no session key found, proceeding login");

          User.findOne({ "username" : username }, function(err, doc) {
            if(err) throw err;
            //checks whether a user with the given username was found
            //if it was then proceed. if not then it notifies the user that their
            //account could not be found
            console.log("searching for user");
            if(doc) {
              console.log("username found");
              //bcrypt checks the given password against the username in the
              //database. if it's true then it proceeds to log them in.
              //if not the the user is notified that the provided password is
              //invalid
              //console.log(doc);
              usernameFull = doc.usernameFull;
              bcrypt.compare(password, doc.password, function(bcErr, success) {
                if(bcErr) throw bcErr;

                if(success) {
                  console.log("password matches");
                  Sess.insert({ "user" : username, "time" : new Date().getTime() }, function(err2, doc2) {
                    if(err2) throw err2;
                    
                    //sets the coookie sessId
                    var newSession = doc2.ops[0]._id;
                    console.log("session created. _id:" + newSession);
                    res.cookie("sessId", newSession);
                    res.redirect("/profile");
                  });
                } else {
                  console.log("password doesn't match");
                  res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Password does not match", "sign-checked" : "", "log-checked" : "checked" });
                }
              });
            } else {
              console.log("user not found");
              res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "User not found", "sign-checked" : "", "log-checked" : "checked" });
            }
          });
        } else {
          console.log("session id present, proceed with session confirmation");
          Sess.findOne({ "_id" : new ObjectId(session) }, function(err, doc) {
            if(err) throw err;

            if(doc) {
              console.log("session found");
              User.findOne({ "username" : doc.user }, function(err2, doc2) {
                if(err2) throw err2;

                if(doc2) {
                  console.log("user matches session, redirecting to profile");
                  res.redirect("/profile");
                } else {
                  console.log("user doesn't match session. clearing sessId and redirection to login");
                  res.clearCookie("sessId");
                  res.redirect("/login");
                }
              });
            } else {
              console.log("no session. clearing sessId and redirecting to login");
              res.clearCookie("sessId");
              res.redirect("/login");
            }
          });
        }
      } else {
        console.log("username and password not present");
        res.render("signupin", { "page" : "signupin", "title" : "Sign Up/Login", "msg" : "Please fill out the form", "sign-checked" : "", "log-checked" : "checked" });
      }
    }
  }
}