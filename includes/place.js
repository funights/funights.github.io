$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
	
	        getPlace(getParameterByName("id"), function(res){
	        	// take the first 5 places
				var template = $("#placePageId").html();
				var compiled = _.template(template);
				
				$("#placeTarget").html(compiled({item:res}));
	        }, function(error){
	        	
	        })
});
