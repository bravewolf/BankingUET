currentPage = {};

currentPage.init = function(){
	WL.Logger.debug("CustomerListPage :: init");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	listCustomers();
};
currentPage.back = function(){
	WL.Logger.debug("CustomerListPage :: back");
	$("#pagePort").load(path + "pages/HomePage.html", function(){
		$.getScript(path + "js/HomePage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
currentPage.loadPage = function(pageIndex){
	WL.Logger.debug("CustomerListPage :: loadPage :: pageIndex: " + pageIndex);
	$("#pagePort").load(path + "pages/" + pageIndex + ".html");
	$.getScript(path + "js/" + pageIndex +".js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};

currentPage.customerDetailPage = function(customerId){
	sessionStorage.setItem("customerId", customerId);
	$("#pagePort").load(path + "pages/CustomerDetailPage.html");
	$.getScript(path + "js/CustomerDetailPage.js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};

function listCustomers(){
	//busyIndicator.show();
	
	var resourceRequest = new WLResourceRequest("/adapters/UserAdapter/", WLResourceRequest.GET);
	resourceRequest.send().then(
			listCustomersSuccess,
			listCustomersFailure
	);
}

function listCustomersSuccess(result){
	WL.Logger.debug("Feed retrieve successfully");
	//busyIndicator.hide();
	WL.Logger.debug(JSON.stringify(result));
	if (result.responseJSON.length>0) 
		displayCustomers(result.responseJSON);
	else 
		listCustomersFailure();
}

function listCustomersFailure(result){
	WL.Logger.error("Feed retrieve failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Service not available. Try again later.", 
			[{
				text : 'Reload',
				handler : WL.Client.reloadApp 
			},
			{
				text: 'Close',
				handler : function() {}
			}]
		);
}

function displayCustomers(customers){
	$("#listPageHeader").html('All Customers');
	var ul = $('#itemsList');
	ul.html('');
	var html ='';
	var i=1;
	$.each(customers, function(index, item) {
		html += '<li><a onclick="currentPage.customerDetailPage('+item.customerId+');" >';
		html += '<b>'+i+ ', Customer ID: </b>' + item.customerId + '<br>';
		html += '<b>First Name: </b>' + item.firstName + '<br>';
		html += '<b> Last Name: </b>' + item.lastName;
		html += '</a></li>';
		i = i+1;
	});
	
	ul.append(html);
}