var pagesHistory = [];
var currentPage = {};
var path = "";
$('#logoutButton').hide();
$('#ManagerLogoutButton').hide();
function wlCommonInit(){
	// Special case for Windows Phone 8 only.
	if (WL.Client.getEnvironment() == WL.Environment.WINDOWS_PHONE_8) {
	    path = "www/default/";
	}
	loadHome();
}

loadHome = function(){
	$("#pagePort").load(path + "pages/HomePage.html", function(){
		$.getScript(path + "js/HomePage.js", function() {
			if (currentPage.init) {
				currentPage.init();
			}
		});
	});
};