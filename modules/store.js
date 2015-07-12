console.log("required store module\r\n");

var	stripe = require("stripe")("sk_test_bhXf8ghDhUnV3gh9ppCbK1gm");
var app = require('express')();/*,
		MongoClient  = require("mongodb"),
		ObjectId = require("mongodb").ObjectID,
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
    purchase: function(req, res, next) {
      var stripeToken = req.body.stripeToken,
          session = req.cookies["sessId"] || "";
      console.log(req.body);

      if(session) {
        Sess.findOne({  "_id" : new ObjectId(session) }, function(err, doc) {
          if(err) throw err;

          if(doc) {
            User.findOne({ "username" : doc.user }, function(err2, doc2) {
              if(err2) throw err2;

              if(doc2) {
                if(doc2.cart && doc2.cart.length > 0) {
                  var amount = doc2.
                }
              } else {
                User.remove({ "_id" : new ObjectId(session) });
                res.clearCookie("sessId");
                res.redirect("/login");
              }
            });
          } else {
            res.redirect("/login");
          }
        });
      } else {
        res.redirect("/login");
      }
    }     
  }
}

////
/*
                  var charge = stripe.charges.create({
                    amount: points * 100, // amount in cents, again
                    currency: "usd",
                    source: stripeToken,
                    description: "Points",
                    statement_descriptor: points * 100 + " website points"
                  }, function(err, charge) {
                    if (err && err.type === 'StripeCardError') {
                      // The card has been declined
                      console.log(err);
                    } else {
                      //console.log(charge);

                      var lastTransaction = {
                        "id": charge.id,
                        "amount": (charge.amount / 100).toFixed(2),
                        "paid_with": charge.source.object,
                        "last4": charge.source.last4
                      }
                      //sets new points based on current user points
                      //and new points to be added
                      var newPoints = points;
                      doc2.transactions.map(function(elem) {
                        //console.log("amount: " + elem.amount);
                        newPoints += parseInt(elem.amount);
                        console.log("amount: " + newPoints);
                      });
                      User.update({ "username" : doc2.username },
                        {
                          "$push" : { "transactions" : lastTransaction },
                          "$set" : { "points" : newPoints }
                        });

                      res.redirect("/success");
                    }
                  });
*/

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