
/* JavaScript content from js/AccountListPage.js in folder common */
currentPage = {};
//var busyIndicator = null;

currentPage.init = function(){
	WL.Logger.debug("AccountListPage :: init");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	listAccount();
};

currentPage.back = function(){
	WL.Logger.debug("AccountListPage :: back");
	$("#pagePort").load(path + "pages/CustomerDetailPage.html", function(){
		$.getScript(path + "js/CustomerDetailfPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
currentPage.detailAccount = function(accountId){
	sessionStorage.setItem("accountId", accountId);
	$("#pagePort").load(path + "pages/AccountDetailPage.html");
	$.getScript(path + "js/AccountDetailPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};

function listAccount(){
	var customerId = sessionStorage.customerId;
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "GetAccounts",
			parameters: [customerId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: listAccountSuccess, 
		onFailure: listAccountFailure
	});
}


function listAccountSuccess(result){
	WL.Logger.debug("Feed retrieve successfully");
	//busyIndicator.hide();
//	alert(result);
//	$("#ResponseDiv").html(JSON.stringify(result));
	WL.Logger.debug(JSON.stringify(result));
	if (result.responseJSON.resultSet.length>0) 
		displayAccountList(result.responseJSON.resultSet);
	else 
		listAccountFailure();
}

function listAccountFailure(result){
	WL.Logger.error("Feed retrieve failure");
	//busyIndicator.hide();
//	$("#ResponseDiv").html(JSON.stringify(result));
	WL.SimpleDialog.show("BankingUET Application", "Service not available. Try again later.", 
			[{
				text : 'Back To Customer Page',
				handler : currentPage.back() 
			}]
		);
}

function displayAccountList(accounts){
	$("#accountListHeader").html('<div class="pageHeader">All accounts</div>');
	var ul = $('#accountList');
	var html ='';
	var i = 1;
	$.each(accounts, function(index, item) {
		html += '<li><a onclick="currentPage.detailAccount('+item.AccountID+');" >';
		html += '<b>Account ID '+i+ ':</b> ' + item.AccountID + '<br>';
		html += '</a></li>';
		i = i+1;
	});
	
	ul.append(html);
}
