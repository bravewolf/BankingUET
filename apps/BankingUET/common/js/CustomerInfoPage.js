currentPage={};

currentPage.init = function() {
	WL.Logger.debug("CustomerInfoPage :: init");
	detailCustomer();
};

currentPage.back = function(){
	WL.Logger.debug("CustomerInfoPage :: back");
	$("#pagePort").load(path + "pages/CustomerDetailPage.html", function(){
		$.getScript(path + "js/CustomerDetailPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};

function detailCustomer(){
	var customerId = sessionStorage.customerId;
	//busyIndicator.show();
	var resourceRequest = new WLResourceRequest("/adapters/UserAdapter/"+customerId, WLResourceRequest.GET);
	resourceRequest.send().then(
			detailCustomerSuccess,
			detailCustomerFailure
	);

}

function detailCustomerSuccess(result){
	WL.Logger.debug("Detail retrieve successfully");
	//busyIndicator.hide();
	if (result.responseJSON != null) {
		displayCustomers(result.responseJSON);
	} 
		
	else 
		detailCustomerFailure();
}

function detailCustomerFailure(result){
	WL.Logger.error("Detail retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Cannot retrieve detail.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}

function displayCustomers(item){
	$("#customerId").html('<b>CustomerId: </b>' + item.customerId + '<br><br>');
	$("#firstName").html('<b>First Name: </b>' + item.firstName + '<br><br>');
	$("#lastName").html('<b>Last Name: </b>' + item.lastName + '<br><br>');
}