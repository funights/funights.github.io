var user;
var allTagsDict = {};
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
	  	getTags(results);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function getTags(results){
	var Tag = Parse.Object.extend("Tag");
	var query = new Parse.Query(Tag);
	query.find({
	  success: function(allTags) {
	  	var addRows    = {};
		 	  	 
	  	for (var i=0; i < allTags.length ; i++) {
	  		allTagsDict[allTags[i].id] = allTags[i];
 		}
 		fillMyPageContent(results);
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
	  
	  var tags = place.get("tags");
  	  var tagsDiv = "";
	  if (tags){
	  	tagsDiv = $("<div><div>");
	  	
	  	for (var i=0; i < tags.length; i++) {
			var tag = tags[i];
			var name = allTagsDict[tag].get("name");
			var span    = $('<span></span>');
			span   .html(name);
			tagsDiv.append(span);
		  };
	  }
	  $("#checkins").append("<div>" + checkIn.get("place").get("name") + "</div>");
	  $("#checkins").append("<div>"+ when+ "</div>");
  	  $("#checkins").append(tagsDiv);
  	  $("#checkins").append("<div>distance:"+ dis+ "</div>");

	  
	};
}
