$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
	
	       var template = $("#myPageId").html();
			var compiled = _.template(template);
			var currentUser = Parse.User.current();
			$("#myPageTarget").html(compiled({item:currentUser}));
});
