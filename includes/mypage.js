$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
	
	       var template = $("#myPageId").html();
			var compiled = _.template(template);
			var userId = "pokcMsJgsd" ; //getCookie("userid");
			
			var currentUser = Parse.User.current();
			var query = new Parse.Query(Parse.User);
			query.get(userId, {
			  success: function(currentUser) {
				$("#myPageTarget").html(compiled({item:currentUser}));
			  }
			});
});

function getFacebookPage(facebookId){
}
