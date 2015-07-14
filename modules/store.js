console.log("required store module\r\n");

var	stripe = require("stripe")("sk_test_bhXf8ghDhUnV3gh9ppCbK1gm");
var app = require('express')(),
		ObjectId = require("mongodb").ObjectID;/*,
    MongoClient  = require("mongodb"),
		Server = MongoClient.Server,
		Db = MongoClient.Db,
		db = new Db("basic-db", new Server("localhost", 27017));

var User = db.collection("users"),
		Profile = db.collection("profiles"),
		Sess = db.collection("sessions");
*/
// (Assuming you're using express - expressjs.com)
// Get the credit card details submitted by the form
module.exports = function(db) {
  var User = db.collection("users"),
      Profile = db.collection("profiles"),
      Sess = db.collection("sessions");

  return {
    addToCart: function(req, res, next) {
      var session = req.cookies["sessId"] || "";
      console.log(req.body);

      if(session) {
        Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
          if(err) throw err;

          if(doc) {
            User.findOne({ "username" : doc.user }, function(err2, doc2) {
              if(err2) throw err2;

              if(doc2) {
                console.log(doc2.cart);
                User.update({ "username" : doc2.username },
                  {
                    "$push" : {
                      "cart" : {
                        "item" : req.body.item.toLowerCase(),
                        "cost" : parseInt(req.body.cost),
                        "description" : req.body.desc
                      }
                    }
                  });
                res.send({
                  action: "success",
                  msg: "Successfully added item to cart"
                });
              } else {
                User.remove({ "_id" : new ObjectId(session) });
                res.clearCookie("sessId");
                res.send({
                  action: "redirect",
                  url: "/login"
                });
              }
            });
          } else {
            res.send({
              action: "redirect",
              url: "/login"
            });
          }
        });
      } else {
        res.send({
          action: "redirect",
          url: "/login"
        });
      }
    },
    purchase: function(req, res, next) {
      var stripeToken = req.body.stripeToken || "",
          session = req.cookies["sessId"] || "";
      console.log(req.body);
      if(req.body && req.body !== {} ) {
        if(session) {
          Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
            if(err) throw err;

            if(doc) {
              User.findOne({ "username" : doc.user }, function(err2, doc2) {
                if(err2) throw err2;

                if(doc2) {
                  if(doc2.cart && doc2.cart.length > 0) {
                    var amount = 0;
                    doc2.cart.map(function(elem) {
                      var tempNum = parseInt(elem.cost);
                      amount += tempNum;
                    });
                    console.log("$" + amount \ 100);
                    //console.log("amount type: " + typeof amount);
                    //amount = parseInt(amount).toFixed(2);

                    console.log("strike token: " + stripeToken);
                    var charge = stripe.charges.create({
                      amount: amount, // amount in cents, again
                      currency: "usd",
                      source: stripeToken,
                      description: "Purchase of " + doc2.cart.length + "items",
                      statement_descriptor: "website purchases"
                    }, function(err, chargeRes) {
                      if (err) {
                        // The card has been declined
                        console.log(err);
                      } else {
                        //console.log(chargeRes);

                        var lastTransaction = {
                          "id": chargeRes.id,
                          "amount": (chargeRes.amount / 100).toFixed(2),
                          "paid_with": chargeRes.source.object,
                          "last4": chargeRes.source.last4
                        }

                        User.update({ "username" : doc2.username },
                          {
                            "$push" : { "transactions" : lastTransaction },
                            "$push" : { "purchaseHistory" : { "$each" : doc2.cart } },
                            "$set" : { "cart" : [] }
                          });

                        res.send({
                          action: "success",
                          msg: "Successfully purchased all items"
                        });
                      }
                    });
                  } else {
                    res.send({
                      action: "redirect",
                      url: "/store"
                    });
                  }
                } else {
                  User.remove({ "_id" : new ObjectId(session) });
                  res.clearCookie("sessId");
                  res.send({
                    action: "redirect",
                    url: "/login"
                  });
                }
              });
            } else {
              res.send({
                action: "redirect",
                url: "/login"
              });
            }
          });
        } else {
          res.send({
            action: "redirect",
            url: "/login"
          });
        }
      } else {
        res.send({
          action: "error",
          msg: "No data submitted"
        });
      }
    }     
  }
}

/* cart format
{
  ...
  cart: [{
    item: "shoe".
    cost: 5.50,
    descrition: "black shoe"
  },
  {
    item: "shirt".
    cost: 10.00,
    descrition: "black shirt"
  },
  {
    item: "pants".
    cost: 7.75,
    descrition: "blue jeans"
  }]
}
*/