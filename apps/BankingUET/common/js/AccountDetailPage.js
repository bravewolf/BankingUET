currentPage={};

currentPage.init = function() {
	WL.Logger.debug("AccountDetailPage :: init");
};

currentPage.back = function(){
	WL.Logger.debug("AccountDetailPage :: back");
	$("#pagePort").load(path + "pages/AccountListPage.html", function(){
		$.getScript(path + "js/AccountListPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
currentPage.transactionHistory = function() {
	var accountId = sessionStorage.accountId;
	sessionStorage.setItem("accountId", accountId);
	WL.Logger.debug("AccountDetailPage :: Transaction History");
	$("#pagePort").load(path + "pages/TransactionHistoryPage.html");
	$.getScript(path + "js/TransactionHistoryPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};
currentPage.transferMoney = function(){
	var accountId = sessionStorage.accountId;
	sessionStorage.setItem("accountId", accountId);
	$("#pagePort").load(path + "pages/TransferPage.html");
	$.getScript(path + "js/TransferPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};
currentPage.accountInfo = function(){
	var accountId = sessionStorage.accountId;
	sessionStorage.setItem("accountId", accountId);
	$("#pagePort").load(path + "pages/AccountInfoPage.html");
	$.getScript(path + "js/AccountInfoPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};

currentPage.removeAccount = function(){
	var accountId = sessionStorage.accountId;
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "DeleteAccount",
			parameters: [accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: removeAccountSuccess, 
		onFailure: removeAccountFailure
	});

}

function removeAccountSuccess(result){
	WL.Logger.debug("Delete successfully");
	WL.SimpleDialog.show("Success","Delete account successfully",[{text:'OK'}]);
	currentPage.back();
}

function removeAccountFailure(result){
	WL.Logger.error("Delete failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Cannot Delete.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}
;