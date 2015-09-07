var user;
$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
		 var template = $("#myPageId").html();
		var compiled = _.template(template);
		var userId = getCookie("userid");
		var query = new Parse.Query(Parse.User);
		var userId = getCookie("userid");
		query.get(userId, {
			success: function(cUser){
				user = cUser;
				$("#myPageTarget").html(compiled({item:cUser}));
				getCheckins();

			}
		});
			
});

function getCheckins(){
	var CheckIn = Parse.Object.extend('CheckIn');
	var query = new Parse.Query(CheckIn);
	query.include("user");
	query.include("place");
	query.equalTo("user", user);
	query.descending("createdAt");
	query.limit(5);
	query.find({
	  success: function(results) {
	  	fillMyPageContent(results);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function fillMyPageContent(res){
	for (var i=0; i < res.length; i++) {
	  var checkIn = res[i];
	  var when = checkIn.get("when").format("dd/m/yy");
	  var place = checkIn.get("place");
	  var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
	  if (dis>=1){
		  dis = dis.toFixed(2) + " km";
	  } else{
	  	  dis = dis.toFixed(3) * 1000 + " m";
	  }
	  
	  $("#checkins").append("<div>" + checkIn.get("place").get("name") + "</div>" + "<div>"+ when+ "</div>"+"<div>distance:"+ dis+ "</div>");
	  
	};
}
