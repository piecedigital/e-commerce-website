$(document).ready(function() {
	$("#payment-form").on("submit", function(e) {
		var form = $(this);

		form.find("button").prop("disabled", true);

		Stripe.card.createToken(form, stripeResponseHandler);

		// prevent default action
		return false
	});

	function stripeResponseHandler(status, res) {
		var form = $("#payment-form");

		if(res.error) {
			// show errors in the form
			form.find(".payment-errors").text(res.error.message);
			form.find("button").prop("disabled", false);
		} else {
			// insert token (res.id) in the form for server submission
			console.log("sent");
			var token = res.id;
			form.append("<input type='hidden' name='stripeToken' value='" + token + "'>");
			form.get(0).submit();
			console.log(res);
		}
	}
});