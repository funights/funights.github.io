var allTagsDict = {};
var user;
$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
		 var template = $("#myPageId").html();
		var compiled = _.template(template);
		var userId = getCookie("userid");
		var query = new Parse.Query(Parse.User);
		query.get(userId, {
			success: function(cUser){
				user = cUser;
				$("#myPageTarget").html(compiled({item:cUser}));
				getCheckins();

			}
		});
			
});

function getAddedPlaces(checkins){
	var Place = Parse.Object.extend('Place');
	var query = new Parse.Query(Place);
	query.include("userAdded");
	query.equalTo("userAdded", user);
	query.descending("createdAt");
	query.limit(5);
	query.find({
	  success: function(results) {
	  	getTags(checkins, results);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

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
          getAddedPlaces(results);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function getTags(checkins, places){
	var Tag = Parse.Object.extend("Tag");
	var query = new Parse.Query(Tag);
	query.find({
	  success: function(allTags) {
	  	var addRows    = {};
		 	  	 
	  	for (var i=0; i < allTags.length ; i++) {
	  		allTagsDict[allTags[i].id] = allTags[i];
 		}
 		fillMyPageContent(checkins, places);
	  }
	});
}

function fillMyCheckins(checkins) {
    for (var i = 0; i < checkins.length; i++) {
        var checkIn = checkins[i];
        var when = checkIn.get("when").format("dd/m/yy");
        var place = checkIn.get("place");

        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
        if (dis >= 1) {
            dis = dis.toFixed(2) + " km";
        } else {
            dis = dis.toFixed(3) * 1000 + " m";
        }

        var tags = place.get("tags");
        var tagsDiv = "";
        if (tags) {
            tagsDiv = $("<div><div>");

            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                var name = allTagsDict[tag].get("name");
                var span = $('<span id='+allTagsDict[tag].id+'></span>');
                span.html(name);
                tagsDiv.append(span);
            };
        }
        $("#checkins").append("<div>" + checkIn.get("place").get("name") + "</div>");
        $("#checkins").append("<div>" + when + "</div>");
        $("#checkins").append(tagsDiv);
        $("#checkins").append("<div>distance:" + dis + "</div>");
    };
}

function fillMyPlaces(places) {
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
        if (dis >= 1) {
            dis = dis.toFixed(2) + " km";
        } else {
            dis = dis.toFixed(3) * 1000 + " m";
        }

        var tags = place.get("tags");
        var tagsDiv = "";
        if (tags) {
            tagsDiv = $("<div><div>");

            for (var j = 0; j < tags.length; j++) {
                var tag = tags[j];
                var name = allTagsDict[tag].get("name");
                var span = $('<span id='+allTagsDict[tag].id+'></span>');
                span.html(name);
                tagsDiv.append(span);
            };
          }
        $("#myplaces").append("<div id='namePlace'>" + place.get("name") + "</div>");
        $("#myplaces").append(tagsDiv);
        $("#myplaces").append("<div id='distancePlace'>distance:" + dis + "</div>");
    }
    ;
}
function fillMyPageContent(checkins, places){
    $("#myscore").html(user.get("score"));
    fillMyPlaces(places);
    fillMyCheckins(checkins);
}
checkCookie();