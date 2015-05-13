
/* JavaScript content from js/CustomerDetailPage.js in folder common */
currentPage={};

currentPage.init = function() {
	WL.Logger.debug("CustomerDetailPage :: init");
};

currentPage.back = function(){
	WL.Logger.debug("CustomerDetailPage :: back");
	$("#pagePort").load(path + "pages/CustomerListPage.html", function(){
		$.getScript(path + "js/CustomerListPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
currentPage.listAccount = function() {
	var customerId = sessionStorage.customerId;
	sessionStorage.setItem("customerId", customerId);
	WL.Logger.debug("CustomerDetailPage :: List Account");
	$("#pagePort").load(path + "pages/AccountListPage.html");
	$.getScript(path + "js/AccountListPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};
currentPage.addAccount = function() {
	var customerId = sessionStorage.customerId;
	sessionStorage.setItem("customerId", customerId);
	WL.Logger.debug("CustomerDetailPage :: Add Account");
	$("#pagePort").load(path + "pages/AccountAddPage.html");
	$.getScript(path + "js/AccountAddPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};
currentPage.infoCustomer = function() {
	var customerId = sessionStorage.customerId;
	sessionStorage.setItem("customerId", customerId);
	WL.Logger.debug("CustomerDetailPage :: Customer Infomation");
	$("#pagePort").load(path + "pages/CustomerInfoPage.html");
	$.getScript(path + "js/CustomerInfoPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};
currentPage.editCustomer = function() {
	var customerId = sessionStorage.customerId;
	sessionStorage.setItem("customerId", customerId);
	WL.Logger.debug("CustomerDetailPage :: Customer Edit");
	$("#pagePort").load(path + "pages/CustomerEditPage.html");
	$.getScript(path + "js/CustomerEditPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};

currentPage.remove = function() {
	WL.Logger.debug("CustomerDetailPage :: delete");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	deleteCustomer();
};

function deleteCustomer(){
	var customerId = sessionStorage.customerId;
	//busyIndicator.show();
	var resourceRequest = new WLResourceRequest("/adapters/UserAdapter/"+customerId, WLResourceRequest.DELETE);
	resourceRequest.send().then(
			deleteCustomerSuccess,
			deleteCustomerFailure
	);
}

function deleteCustomerSuccess(result){
	WL.Logger.debug("Delete successfully");
	//busyIndicator.hide();
	WL.SimpleDialog.show("Success","Delete customer successfully",[{text:'OK'}]);
	//busyIndicator.hide();
	currentPage.back();
}

function deleteCustomerFailure(result){
	WL.Logger.error("Delete failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Cannot delete.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}
