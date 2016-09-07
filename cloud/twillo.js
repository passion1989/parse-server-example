var twilioClient = require('twilio')('AC39e5bda1d697ab9fcf9eb835beb314e3', '322f5947ea928d963813d9bcc31a91a5');

/*
 * Send verification code to user's phone number. Just need to upload user id (object ID).
 */
Parse.Cloud.define("sendVerificationCode", function(request, response) {
	var userId = request.params.user_id

	// Get proper user from user table.
	var query = new Parse.Query(Parse.User);

	query.get(userId,{ useMasterKey: true }).then(function(user){

		Parse.Config.get({ useMasterKey: true }).then(function(config){
				twilioSID = config.get("twilioSID");
				twilioToken = config.get("twilioToken")
				twilloPhoneNumber = config.get("twilloPhoneNumber")

				userPhoneNumber = user.get("phonenumber")
				
				var verificationCode = 1000 + Math.floor(Math.random()*8888);
		    	user.set("phoneVerificationCode", verificationCode + "");
				
				user.save().then(function() {
			    	twilioClient.sendSms({

				        From: twilloPhoneNumber,
				        To: userPhoneNumber,
				        Body: "Your verification code for app is " + verificationCode + "."
				    }, function(err, responseData) { 
			    	    if (err) {
			        	  response.error(err);
				        } else { 
				          response.success("Your verification code is " + verificationCode);
				        }
				    });
        		});
				
		});

	}, function(error){
		response.error(error);
	});

});



/*
 * Verify phone number using verficiation code
 */


Parse.Cloud.define("verifyPhoneNumber", function(request, response) {
	var userId = request.params.user_id
	
	// Get proper user from user table.
	var query = new Parse.Query(Parse.User);

	query.get(userId,{ useMasterKey: true }).then(function(user){
			var verificationCode = user.get("phoneVerificationCode");
		    if (verificationCode == request.params.phoneVerificationCode) {
		        response.success("Success");
		    } else {
		        response.error("Invalid verification code.");
		    }
	});

});
