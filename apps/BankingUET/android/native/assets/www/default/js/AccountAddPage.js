
/* JavaScript content from js/AccountAddPage.js in folder common */
currentPage={};

currentPage.init = function() {
	WL.Logger.debug("AccountAddPage :: init");
};

currentPage.back = function(){
	WL.Logger.debug("AccountAddPage :: back");
	$("#pagePort").load(path + "pages/CustomerDetailPage.html", function(){
		$.getScript(path + "js/CustomerDetailPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
function makeAccountId()
{
    var makeAccountId = "";
    var possible = "123456789";

    for( var i=0; i < 15; i++ )
    	makeAccountId += possible.charAt(Math.floor(Math.random() * possible.length));

    return makeAccountId;
}
currentPage.add = function(){
	WL.Logger.debug("AccountAddPage :: add");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	var customerId = sessionStorage.customerId;
	var accountId = makeAccountId();
	var accountBalance = $("#accountBalance").val();
	var accountType = $("#accountType").val();
	if(accountBalance == ""){
		WL.SimpleDialog.show("Alert","Please enter account balance",[{text:'OK'}]);
	} else if(!(!isNaN(accountBalance) && parseInt(Number(accountBalance)) == accountBalance && !isNaN(parseInt(accountBalance, 10)))){
		WL.SimpleDialog.show("Alert","Please enter an integer for account balance",[{text:'OK'}]);
	} else if(accountType == ""){
		WL.SimpleDialog.show("Alert","Please select an account type",[{text:'OK'}]);
	} else{
		createAccount(customerId,accountId,accountBalance,accountType);
	}
};

function createAccount(customerId,accountId,accountBalance,accountType){
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "CreateAccount",
			parameters: [customerId,accountId,accountBalance,accountType]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: createAccountSuccess, 
		onFailure: createAccountFailure
	});
}

function createAccountSuccess(result){
	WL.Logger.debug("Create account successfully");
	WL.SimpleDialog.show("Success","Create account successfully",[{text:'OK'}]);
	//busyIndicator.hide();
	currentPage.back();
}

function createAccountFailure(result){
	WL.Logger.error("Create account failure");
	//busyIndicator.hide();
}