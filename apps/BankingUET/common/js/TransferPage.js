currentPage={};
var currentAccountBalance;
currentPage.init = function() {
	WL.Logger.debug("Transfer :: init");
	var fromAccount = sessionStorage.accountId;
	showCurrentBalance();
	$("#fromAccount").html('<b>From Account: </b>' + fromAccount + '<br><br>');
};

currentPage.back = function(){
	WL.Logger.debug("Transfer :: back");
	$("#pagePort").load(path + "pages/AccountDetailPage.html", function(){
		$.getScript(path + "js/AccountDetailPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
currentPage.historyPage = function(){
	WL.Logger.debug("Transfer :: back");
	$("#pagePort").load(path + "pages/TransactionHistoryPage.html", function(){
		$.getScript(path + "js/TransactionHistoryPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
function makeTransactionId()
{
    var TransactionId = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 12; i++ )
    	TransactionId += possible.charAt(Math.floor(Math.random() * possible.length));

    return TransactionId;
}
currentPage.transfer = function(){
	WL.Logger.debug("Transfer :: Transfer");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	var transactionId =  makeTransactionId();
	var fromAccount = sessionStorage.accountId;
	var toAccount = $("#toAccount").val();
	var transactionAmount = $("#transactionAmount").val();
	var transactionType = 'Funds Transfer';
	var transactionDate = new Date().toISOString().slice(0, 19).replace('T', ' ');;
	if(toAccount == ""){
		WL.SimpleDialog.show("Alert","Please enter target account",[{text:'OK'}]);
	} else if(transactionAmount == ""){
		WL.SimpleDialog.show("Alert","Please enter transaction's amount",[{text:'OK'}]);
	} else if(!(!isNaN(transactionAmount) && parseInt(Number(transactionAmount)) == transactionAmount && !isNaN(parseInt(transactionAmount, 10)))){
		WL.SimpleDialog.show("Alert","Please enter an integer for transaction amount",[{text:'OK'}]);
	}else{
		getTargetBalance();
		getCurrentBalance();
		createTransaction(transactionId,fromAccount,toAccount,transactionAmount, transactionDate,transactionType);
		
	}
};
//exchange balances
function exchangeBalances()
{
    var currentAccountBalance = parseInt(sessionStorage.currentAccountBalance);
    var targetAccountBalance =  parseInt(sessionStorage.targetAccountBalance);
    var fromAccount =  sessionStorage.accountId;
    var toAccount =  $("#toAccount").val();
    var transactionAmount =  parseInt($("#transactionAmount").val());
    

    var newCurrentAccountBalance = currentAccountBalance - transactionAmount;
    var newTargetAccountBalance = targetAccountBalance + transactionAmount;
    sessionStorage.removeItem("currentAccountBalance");
	sessionStorage.removeItem("targetAccountBalance");
    
    updateBalance(newCurrentAccountBalance, fromAccount);
    updateBalance(newTargetAccountBalance, toAccount);
}

//update balance
function updateBalance(accountBalance, accountId){
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "UpdateBalance",
			parameters: [accountBalance, accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: updateBalanceSuccess, 
		onFailure: updateBalanceFailure
	});
}

function updateBalanceSuccess(result){

}
function updateBalanceFailure(result){
	WL.Logger.error("Detail retrieve failure");
	WL.SimpleDialog.show("updateBalanceFailure", "Cannot retrieve detail.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}
//
function createTransaction(transactionId,fromAccount,toAccount,transactionAmount, transactionDate,transactionType){
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "CreateTransaction",
			parameters: [transactionId,fromAccount,toAccount,transactionAmount, transactionDate,transactionType]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: createTransactionSuccess, 
		onFailure: createTransactionFailure
	});
}

function createTransactionSuccess(result){
	//WL.Logger.debug("Create Transaction success");
	//WL.SimpleDialog.show("Success","Create Transaction success",[{text:'OK'}]);
	//busyIndicator.hide();
	exchangeBalances();
	currentPage.historyPage();
}

function createTransactionFailure(result){
	WL.Logger.error("Create Transaction failure");
	//busyIndicator.hide();
}
function getCurrentBalance(){
	var accountId = sessionStorage.accountId;
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "GetBalance",
			parameters: [accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: getCurrentBalanceSuccess, 
		onFailure: getCurrentBalanceFailure
	});

}

function getCurrentBalanceSuccess(result){
	WL.Logger.debug("Detail retrieve success");
	//busyIndicator.hide();
	if (result.responseJSON.resultSet != null) {
		$("#currentAccountBalance").html('<b>Current Account Balance: </b>' + result.responseJSON.resultSet[0].AccountBalance + '<b> USD</b><br><br>');
		sessionStorage.setItem("currentAccountBalance", result.responseJSON.resultSet[0].AccountBalance);
	} 		
	else 
		getCurrentBalanceFailure();
}

function getCurrentBalanceFailure(result){
	WL.Logger.error("Detail retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("getCurrentBalanceFailure", "Cannot retrieve detail.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}

function getTargetBalance(){
	var accountId = $("#toAccount").val();
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "GetBalance",
			parameters: [accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: getTargetBalanceSuccess, 
		onFailure: getTargetBalanceFailure
	});

}

function getTargetBalanceSuccess(result){
	WL.Logger.debug("Detail retrieve success");
	//busyIndicator.hide();
	if (result.responseJSON.resultSet != null) {
		sessionStorage.setItem("targetAccountBalance", result.responseJSON.resultSet[0].AccountBalance);
	} 		
	else 
		getTargetBalanceFailure();
}

function getTargetBalanceFailure(result){
	WL.Logger.error("Detail retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("getTargetBalanceFailure", "Cannot retrieve detail.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}
//
function showCurrentBalance(){
	var accountId = sessionStorage.accountId;
	//busyIndicator.show();
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "GetBalance",
			parameters: [accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: showCurrentBalanceSuccess, 
		onFailure: showCurrentBalanceFailure
	});

}

function showCurrentBalanceSuccess(result){
	WL.Logger.debug("Detail retrieve success");
	//busyIndicator.hide();
	if (result.responseJSON.resultSet != null) {
		$("#currentAccountBalance").html('<b>Current Account Balance: </b>' + result.responseJSON.resultSet[0].AccountBalance + '<b> USD</b><br><br>');
		//sessionStorage.setItem("currentAccountBalance", result.responseJSON.resultSet[0].AccountBalance);
	} 		
	else 
		showCurrentBalanceFailure();
}

function showCurrentBalanceFailure(result){
	WL.Logger.error("Detail retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("getCurrentBalanceFailure", "Cannot retrieve detail.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}