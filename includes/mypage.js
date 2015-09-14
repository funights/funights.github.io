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
				var score = cUser.get( "score");
				var scoreStatus = "אדם עסוק";
				var scoreColor  = "#fff";
				     if( score >= 100  && score < 500  ) { scoreStatus = "בליין מתחיל"; scoreColor = "blue";  }
				else if( score >= 500  && score < 1000 ) { scoreStatus = "בליין ממוצע" ; scoreColor = "green"; }
				else if( score >= 1000                 ) { scoreStatus = "בליין מטורף" ; scoreColor = "gold";  }
				
				$( ".myName, #mystatus" ).css( "color", scoreColor );
				
				$( "#mystatus" ).html( scoreStatus );
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
        var when    = checkIn.get("when").format("dd/m/yy");
        var place   = checkIn.get("place");

        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
        if (dis >= 1) {
            dis = dis.toFixed(2) + " km";
        } else {
            dis = dis.toFixed(3) * 1000 + " m";
        }

        var tags = place.get("tags");
        var tagsDiv = "";
        if (tags) {
            tagsDiv = $("<div></div>");
            var mytags = [];
            for (var j = 0; j < tags.length; j++) {
                var tag  = tags[j];
                if (mytags.indexOf(tag) > -1){
                    continue;
                }
                mytags.push(tag);
                if (allTagsDict[tag]){
                    var name = allTagsDict[tag].get("name");
                    var span = $('<span id='+allTagsDict[tag].id+'></span>');
                    span.html(name);
                    tagsDiv.append(span);
                }
            };
        }
        
        
        $('#checkins').append("<div></div>");
        var row =  $("#checkins > div:last-child");

        $(row).append("<div><a href='" + "placePage.html?id="+ checkIn.get("place").id + "'><img src='" + (checkIn.get("place").get("placePic").url()) + "'></a></div>");
        var place = $("<div>" + checkIn.get("place").get("name") + "</div>");
        var when  = $("<div>" + when + "</div>");
        
        var tagsCell = $("<div></div>");
        
        $( tagsCell ).append( place);
        $( tagsCell ).append( when );
        $(tagsCell).append("<div>" + dis + "</div>");
        $( tagsCell ).append( tagsDiv );
        $(row).append( tagsCell ); 
    };
}

function fillMyPlaces(places) {
    for (var i = 0; i < places.length; i++) {
        var myplaces = places[i];
        var when    = myplaces.get("when").format("dd/m/yy");
        var place   = myplaces.get("place");
        
        var dis = calcDistance(place.get("address_geo").latitude, myplaces.get("address_geo").longitude);
        if (dis >= 1) {
            dis = dis.toFixed(2) + " km";
        } else {
            dis = dis.toFixed(3) * 1000 + " m";
        }

        var tags = place.get("tags");
        var tagsDiv = "";
        if (tags) {
            tagsDiv = $("<div><div>");
            var mytags = [];
            for (var j = 0; j < tags.length; j++) {
                var tag  = tags[j];
                if (mytags.indexOf(tag) > -1 || !allTagsDict[tag]){
                    continue;
                }
                mytags.push(tag);
                var name = allTagsDict[tag].get("name");
                var id   = allTagsDict[tag].id;
                var span = $('<span id='+id+'></span>');
                span.html(name);
                tagsDiv.append(span);
            };
          }
          
        $('#myplaces').append("<div></div>");
        var row = $("#myplaces > div:last-child");
          
        $(row).append("<div><a href='" + "placePage.html?id="+ myPlaces.get("place").id + "'><img src='" + (myPlaces.get("place").get("placePic").url()) + "'></a></div>");
        var place = $("<div>" + myplaces.get("place").get("name") + "</div>");
        var when =  $("<div>" + when + "</div>");
        
        var placesTagsCell = $("<div></div>");
        
        $(placesTagsCell).append(place);
        $(placesTagsCell).append(when);
        $(placesTagsCell).append("<div>" + dis + "</div>");
        $(placesTagsCell).append(tagsDiv);
        $(row).append (placeTagsCell);
        
      /*    
        $("#myplaces").append("<div id='namePlace'>" + lastPlace.get("name") + "</div>");
        $("#myplaces").append(tagsDiv);
        $("#myplaces").append("<div id='distancePlace'>distance:" + dis + "</div>");
    */
    };
}

function fillMyPageContent(checkins, places){
    $("#myscore").html(user.get("score"));
    fillMyPlaces(places);
    fillMyCheckins(checkins);
}
checkCookie();