
/* JavaScript content from js/HomePage.js in folder common */
currentPage = {};

currentPage.init = function(){
	$('#homeButton').hide();
	$('#backButton').hide();
	WL.Logger.debug("HomePage :: init");
};

currentPage.loadPage = function(pageIndex){
	$('#homeButton').show();
	$('#backButton').show();
	WL.Logger.debug("HomePage :: loadPage :: pageIndex: " + pageIndex);
	$("#pagePort").load(path + "pages/" + pageIndex + ".html");
	$.getScript(path + "js/" + pageIndex +".js", function() {
		if (currentPage.init) {
			currentPage.init();
		}
	});
};