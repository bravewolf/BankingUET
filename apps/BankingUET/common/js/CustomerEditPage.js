currentPage={};

currentPage.init = function() {
	WL.Logger.debug("CustomerDetailPage :: init");
	detailCustomer();
	$('#currentPassword').hide();
};

currentPage.back = function(){
	WL.Logger.debug("CustomerDetailPage :: back");
	$("#pagePort").load(path + "pages/CustomerDetailPage.html", function(){
		$.getScript(path + "js/CustomerDetailPage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};


currentPage.edit = function() {
	WL.Logger.debug("DetailPage :: edit");
	//busyIndicator = new WL.BusyIndicator('AppBody');
	
	var customerId = sessionStorage.customerId;
	var firstName = $("#editFirstName").val();
	var lastName = $("#editLastName").val();
	var currentPassword = $("#currentPassword").val();
	var newPassword = $("#newPassword").val();
	var confirmNewPassword = $("#confirmNewPassword").val()
	var oldPassword = $("#oldPassword").val();
	if(customerId == ""){
		WL.SimpleDialog.show("Alert","Please enter Customer Id",[{text:'OK'}]);
	} else if(!(!isNaN(customerId) && parseInt(Number(customerId)) == customerId && !isNaN(parseInt(customerId, 10)))){
		WL.SimpleDialog.show("Alert","Please enter an integer for Customer Id",[{text:'OK'}]);
	} else if(firstName == ""){
		WL.SimpleDialog.show("Alert","Please enter first Name",[{text:'OK'}]);
	} else if(lastName == ""){
		WL.SimpleDialog.show("Alert","Please enter last Name",[{text:'OK'}]);
	} else if(oldPassword == ""){
		WL.SimpleDialog.show("Alert","Please enter old password",[{text:'OK'}]);
	}else if(newPassword == ""){
		WL.SimpleDialog.show("Alert","Please enter new password",[{text:'OK'}]);
	}else if(confirmNewPassword == ""){
		WL.SimpleDialog.show("Alert","Please confirm new password",[{text:'OK'}]);
	}else if(newPassword != confirmNewPassword){
		WL.SimpleDialog.show("Alert","Invalid field: Confirm New Password",[{text:'OK'}]);
	}else if(oldPassword != currentPassword){
		WL.SimpleDialog.show("Alert","Old password is wrong",[{text:'OK'}]);
	}else{
		editCustomer(customerId,firstName,lastName,newPassword);
	}
	
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
	$("#editCustomerId").html('<b>CustomerId: </b>' + item.customerId + '<br><br>');
	$('#editFirstName').val(item.firstName);
	$('#editLastName').val(item.lastName);
	$('#currentPassword').val(item.password);
}

function editCustomer(customerId,firstName,lastName,password){
	//busyIndicator.show();
	var resourceRequest = new WLResourceRequest("/adapters/UserAdapter/"+customerId, WLResourceRequest.PUT);
	var customer = {
		    "firstName": firstName,
		    "lastName": lastName,
		    "password": password
	};
	resourceRequest.sendFormParameters(customer).then(
			editCustomerSuccess,
			editCustomerFailure
	);
}

function editCustomerSuccess(result){
	WL.Logger.debug("Edit successfully");
	//busyIndicator.hide();
	WL.SimpleDialog.show("Success","Edit customer successfully",[{text:'OK'}]);
	//busyIndicator.hide();
	currentPage.back();
}

function editCustomerFailure(result){
	WL.Logger.error("Edit failure");
	//busyIndicator.hide();
	WL.SimpleDialog.show("BankingUET Application", "Cannot edit.", 
	[{
		text : 'Reload App',
		handler : WL.Client.reloadApp 
	}]);
}