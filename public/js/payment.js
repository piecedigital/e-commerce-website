$(document).ready(function() {
  $(document).on("submit", "#checkout-form", function() {
    var form = $(this),
        formData = form.serializeArray();

    Stripe.card.createToken(form, stripeResponseHandler);

    $(form).find("button").prop("disabled", true);


    return false;
  });

  function stripeResponseHandler(status, res) {
    var form = $("#checkout-form");

    if(res.error) {
      // show errors in the form
      $(form).find(".msg").text(res.error.message);
      $(form).find("button").prop("disabled", false);
    } else {
      // insert token (res.id) in the form for server submission
      console.log("sent");

      var token = res.id;

      var dataObj = {
        stripeToken: token
      }

      console.log(token);
      console.log(dataObj);
      sendData(dataObj);
    }
  }

  function sendData(dataObj) {
  	var form = $("#checkout-form");
  	
    $.ajax({
      url: "/purchase",
      type: "POST",
      cookies: document.cookie,
      data: dataObj,
      success: function(res) {
        console.log(res);
        if(res.action === "redirect") {
          window.location.href = res.url;
        }
        if(res.action === "success") {
          console.log(res.msg);
          $(form).find(".msg").html(res.msg);
        }
        if(res.action === "error") {
          console.log(res.msg);
          $(form).find(".msg").html(res.msg);
        }
      }
    });
  }
});