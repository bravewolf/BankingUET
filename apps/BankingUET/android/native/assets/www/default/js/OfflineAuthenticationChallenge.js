
/* JavaScript content from js/OfflineAuthenticationChallenge.js in folder common */
/*
 * Challenge handler for single-step adapter authentication.
 */
var OfflineRealmChallengeHandler = WL.Client.createChallengeHandler("OfflineRealm");

OfflineRealmChallengeHandler.isCustomResponse = function(response) {
	if (!response || !response.responseJSON	|| response.responseText === null) {
		return false;
	}
	if (typeof(response.responseJSON.authRequired) !== 'undefined'){
		return true;
	} else {
		return false;
	}
};

OfflineRealmChallengeHandler.handleChallenge = function(response){
	var authRequired = response.responseJSON.authRequired;

	// Authentication required, display the login form and the online login button.
	if (authRequired == true){
		if (!($("#developerAuthDiv").is(":visible"))) { 
			$("#unsecuredDiv").hide();
			$("#developerAuthDiv").show();
			$("#offlineLoginButton").hide();
			$("#onlineLoginButton").show();
		}
		
		$("#username").val('');
		$("#password").val('');
		$("#authInfo").empty();

		if (response.responseJSON.errorMessage) {
	    	$("#authInfo").html(response.responseJSON.errorMessage);
		}
		
	} else if (authRequired == false){
		OfflineRealmChallengeHandler.submitSuccess();
	}
};

$("#onlineLoginButton").bind('click', function () {
	var invocationData = {
		adapter : "authenticationAdapter",
		procedure : "submitAuthentication",
		parameters : [$("#username").val(), $("#password").val()]
	};

	OfflineRealmChallengeHandler.submitAdapterAuthentication(invocationData, {});
});

$("#cancelLoginButton").bind('click', function () {
	OfflineRealmChallengeHandler.submitFailure();
	$("#developerAuthDiv").hide();
    $("#unsecuredDiv").show();
});
