var authenticatorRealmChallengeHandler = WL.Client.createChallengeHandler("AuthenticatorRealm");

authenticatorRealmChallengeHandler.isCustomResponse = function(response) {
    if (!response || !response.responseJSON) {
        return false;
    }
    
    if (response.responseJSON.authStatus) 
    	return true;
    else 
    	return false;
};

authenticatorRealmChallengeHandler.handleChallenge = function(response){
	var authStatus = response.responseJSON.authStatus;

	if (authStatus == "requiredcustomer"){
		$('#AppDiv').hide();
		$('#homeButton').hide();
		$('#backButton').hide();
		$('#AuthDiv').show();
		$("#AuthInfo").empty();
		$('#AuthPassword').val('');
		$('#AuthUsername').val('customer');
        if (response.responseJSON.errorMessage){
        	$("#AuthInfo").html(response.responseJSON.errorMessage);
        }
	} else if (authStatus == "customercomplete"){
		$('#AppDiv').show();
		$('#homeButton').show();
		$('#backButton').show();
		$('#AuthDiv').hide();
		$('#logoutButton').show();
		authenticatorRealmChallengeHandler.submitSuccess();
	}else if (authStatus == "requiredmanager"){
		$('#AppDiv').hide();
		$('#homeButton').hide();
		$('#backButton').hide();
		$('#AdminAuthDiv').show();
		$("#AdminAuthInfo").empty();
		$('#AdminAuthPassword').val('');
		$('#AdminAuthUsername').val('bankmanager');
        if (response.responseJSON.errorMessage){
        	$("#AdminAuthInfo").html(response.responseJSON.errorMessage);
        }
	} else if (authStatus == "managercomplete"){
		$('#AppDiv').show();
		$('#homeButton').show();
		$('#backButton').show();
		$('#AdminAuthDiv').hide();
		$('#ManagerLogoutButton').show();
		authenticatorRealmChallengeHandler.submitSuccess();
	}
};

authenticatorRealmChallengeHandler.submitLoginFormCallback = function(response) {
    var isLoginFormResponse = authenticatorRealmChallengeHandler.isCustomResponse(response);
    if (isLoginFormResponse){
    	authenticatorRealmChallengeHandler.handleChallenge(response);
    } 
};

$('#AuthSubmitButton').bind('click', function () {
    var reqURL = '/customer_auth_request_url';
    var options = {};
    options.parameters = {
        username : $('#AuthUsername').val(),
        password : $('#AuthPassword').val()
    };
    options.headers = {};
    authenticatorRealmChallengeHandler.submitLoginForm(reqURL, options, authenticatorRealmChallengeHandler.submitLoginFormCallback);
});

$('#AuthCancelButton').bind('click', function () {
	$('#AppDiv').show();
	$('#homeButton').show();
	$('#backButton').show();
	$('#AuthDiv').hide();
	currentPage.back();
	authenticatorRealmChallengeHandler.submitFailure();
});
$('#AdminAuthSubmitButton').bind('click', function () {
    var reqURL = '/manager_auth_request_url';
    var options = {};
    options.parameters = {
        username : $('#AdminAuthUsername').val(),
        password : $('#AdminAuthPassword').val()
    };
    options.headers = {};
    authenticatorRealmChallengeHandler.submitLoginForm(reqURL, options, authenticatorRealmChallengeHandler.submitLoginFormCallback);
});

$('#AdminAuthCancelButton').bind('click', function () {
	$('#AppDiv').show();
	$('#homeButton').show();
	$('#backButton').show();
	$('#AdminAuthDiv').hide();
	authenticatorRealmChallengeHandler.submitFailure();
});

