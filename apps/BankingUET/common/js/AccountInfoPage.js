currentPage={};

currentPage.init = function() {
	WL.Logger.debug("AccountDetailPage :: init");
	detailAccount();
};

currentPage.back = function(){
	WL.Logger.debug("AccountDetailPage :: back");
	$("#pagePort").load(path + "pages/AccountDetailPage.html", function(){
		$.getScript(path + "js/AccountDetailPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};


function detailAccount(){
	var accountId = sessionStorage.accountId;
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "GetAccountInfo",
			parameters: [accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: detailAccountSuccess, 
		onFailure: detailAccountFailure
	});

}

function detailAccountSuccess(result){
	WL.Logger.debug("Detail retrieve successfully");
	//busyIndicator.hide();
	if (result.responseJSON.resultSet != null) {
		displayAccount(result.responseJSON.resultSet);
	} 
		
	else 
		detailAccountFailure();
}

function detailAccountFailure(result){
	WL.Logger.error("Detail retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Cannot retrieve detail.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}

function displayAccount(item){
	$("#accountBalance").html(JSON.stringify(item[0].AccountBalance));
	$("#showAccountType").html(item[0].AccountType);
}
