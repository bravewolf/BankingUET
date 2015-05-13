
/* JavaScript content from js/CustomerAddPage.js in folder common */
currentPage={};

currentPage.init = function() {
	WL.Logger.debug("CustomerAddPage :: init");
};

currentPage.back = function(){
	WL.Logger.debug("CustomerAddPage :: back");
	$("#pagePort").load(path + "pages/HomePage.html", function(){
		$.getScript(path + "js/HomePage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};
function makeCustomerId()
{
    var makeCustomerId = "";
    var possible = "123456789";

    for( var i=0; i < 15; i++ )
    	makeCustomerId += possible.charAt(Math.floor(Math.random() * possible.length));

    return makeCustomerId;
}

currentPage.add = function(){
	WL.Logger.debug("AddPage :: add");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	var customerId = makeCustomerId()
	var lastName = $("#lastName").val();
	var firstName = $("#firstName").val();
	var password = $("#password").val();
	if(firstName == ""){
		WL.SimpleDialog.show("Alert","Please enter first Name",[{text:'OK'}]);
	} else if(lastName == ""){
		WL.SimpleDialog.show("Alert","Please enter last Name",[{text:'OK'}]);
	} else if(password == ""){
		WL.SimpleDialog.show("Alert","Please enter password",[{text:'OK'}]);
	} else{
		createCustomer(customerId,lastName,firstName,password);
	}
};

function createCustomer(customerId,lastName,firstName,password){
	//busyIndicator.show();
	var resourceRequest = new WLResourceRequest("/adapters/UserAdapter/", WLResourceRequest.POST);
	var customer = {
		    "customerId": customerId,
		    "firstName": firstName,
		    "lastName": lastName,
		    "password": password
	};
	resourceRequest.sendFormParameters(customer).then(
			addCustomerSuccess,
			addCustomerFailure
	);
}

function addCustomerSuccess(result){
	WL.Logger.debug("Add customer successfully");
	WL.SimpleDialog.show("Success","Add customer successfully",[{text:'OK'}]);
	//busyIndicator.hide();
	currentPage.back();
}

function addCustomerFailure(result){
	WL.Logger.error("Add customer failure");
	//busyIndicator.hide();
}