
/* JavaScript content from js/TransactionHistoryPage.js in folder common */
currentPage={};
currentPage.init = function() {
	WL.Logger.debug("TransactionHistoryPage :: init");
	transactionHistory();
};

currentPage.back = function(){
	WL.Logger.debug("TransactionHistoryPage :: back");
	$("#pagePort").load(path + "pages/AccountDetailPage.html", function(){
		$.getScript(path + "js/AccountDetailPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};


function transactionHistory(){
	var accountId = sessionStorage.accountId;
	//busyIndicator.show();
	
	var invocationData = {
			adapter : "SQLAdapter",
			procedure: "GetTransactionList",
			parameters: [accountId,accountId]
	};
	
	WL.Client.invokeProcedure(invocationData, {
		onSuccess: transactionHistorySuccess, 
		onFailure: transactionHistoryFailure
	});

}

function transactionHistorySuccess(result){
	WL.Logger.debug("Detail retrieve successfully");
	//busyIndicator.hide();
	if (result.responseJSON.resultSet.length>0) {
		displayTransactionHistory(result.responseJSON.resultSet);
	} 
		
	else 
		transactionHistoryFailure();
}

function transactionHistoryFailure(result){
	WL.Logger.error("Detail retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Cannot retrieve detail.", 
	[{
		text : 'Back To Account Page',
		handler :currentPage.back()
	}]);
	
}

function displayTransactionHistory(transactions){
	var ul = $('#transactionHistoryList');
	var html ='';
	var i=1;
	$.each(transactions, function(index, item) {
		html += '<li><i>'+i+', Transaction '+i+': </i><br>';
		html += '<b>From Account: </b>' + item.fromAccount + '<br>';
		html += '<b>To Account: </b>' + item.toAccount + '<br>';
		html += '<b>Transaction Amount: </b>' + item.transactionAmount + '<b> USD</b><br>';
		html += '<b>Transaction Type: </b>' + item.transactionType + '<br>';
		html += '<b>Transaction Date: </b>' + item.transactionDate;
		html += '</li>';
		i= i +1;
	});
	
	ul.append(html);
}

