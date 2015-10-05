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
					 if( score <  100                  ) { scoreStatus = "בליין?!"   ; scoreColor = "#FFFFFF";   }
				else if( score >= 100  && score < 500  ) { scoreStatus = "בליין מתחיל" ; scoreColor = "#FF235A";   }
				else if( score >= 500  && score < 1000 ) { scoreStatus = "בליין ממוצע" ; scoreColor = "#4CFF67";    }
				else if( score >= 1000                 ) { scoreStatus = "בליין מטורף" ; scoreColor = "#C425FF";    }
				 
				$( ".myName, #myStatus, #myscore" ).css( "color", scoreColor );
				$( "#myscore"                     ).html( user.get("score"));
				$( "#myStatus"                    ).html( scoreStatus );
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
	  //   alert("Error: " + error.code + " " + error.message);
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
	if( screen.width <= 600){
		setTimeout(function(){
		    for (var i = 0; i < checkins.length; i++) {
		        var checkIn = checkins[i];
		        var when    = checkIn.get("when").format("dd/m/yy");
		        var place   = checkIn.get("place");
		        if (!place){
		            continue;
		        }
		        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
		        if (dis >= 1) {
		            dis = dis.toFixed(2) + " km"+ "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
		   		
		        } else {
		            dis = dis.toFixed(3) * 1000 + " m" + "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
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
		
	   },3000);
   	}	
	   
	   else{
		    for (var i = 0; i < checkins.length; i++) {
		        var checkIn = checkins[i];
		        var when    = checkIn.get("when").format("dd/m/yy");
		        var place   = checkIn.get("place");
		        if (!place){
		            continue;
		        }
		        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
		        if (dis >= 1) {
		            dis = dis.toFixed(2) + " km"+ "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
		   		
		        } else {
		            dis = dis.toFixed(3) * 1000 + " m" + "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
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
		    }	
	   }
}

function fillMyPlaces(places) {
	if( screen.width <= 600){
	setTimeout(function(){
    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        if (!place){
            continue;
        }
        var when    = place.createdAt.format("dd/m/yy");
        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
        if (dis >= 1) {
            dis = dis.toFixed(2) + " km" + "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
        } else {
            dis = dis.toFixed(3) * 1000 + " m" + "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
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
        
        var row = $("<div></div>");

        row.append("<div><a href='" + "placePage.html?id="+ place.id + "'><img src='" + place.get("placePic").url() + "'></a></div>");
        var place = $("<div>" + place.get("name") + "</div>");
        var when  = $("<div>" + when + "</div>");
        
        var tagsCell = $("<div></div>");
        
        $(tagsCell ).append( place);
        $(tagsCell ).append( when );
        $(tagsCell ).append( "<div>" + dis + "</div>");
        $(tagsCell ).append( tagsDiv );
        $(row      ).append( tagsCell ); 
        $("#lastPlaces").append(row);
    }
   },3000);
  }
   
   else{
   	    for (var i = 0; i < places.length; i++) {
        var place = places[i];
        if (!place){
            continue;
        }
        var when    = place.createdAt.format("dd/m/yy");
        var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
        if (dis >= 1) {
            dis = dis.toFixed(2) + " km" + "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
        } else {
            dis = dis.toFixed(3) * 1000 + " m" + "<a  class= 'waze4' href= 'waze://?ll="+place.get("address_geo").latitude +","+ place.get("address_geo").longitude+"'><img src='images/waze.png'></a>";
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
        
        var row = $("<div></div>");

        row.append("<div><a href='" + "placePage.html?id="+ place.id + "'><img src='" + place.get("placePic").url() + "'></a></div>");
        var place = $("<div>" + place.get("name") + "</div>");
        var when  = $("<div>" + when + "</div>");
        
        var tagsCell = $("<div></div>");
        
        $(tagsCell ).append( place);
        $(tagsCell ).append( when );
        $(tagsCell ).append( "<div>" + dis + "</div>");
        $(tagsCell ).append( tagsDiv );
        $(row      ).append( tagsCell ); 
        $("#lastPlaces").append(row);
    
   }
  }
}

function fillMyPageContent(checkins, places){
    fillMyCheckins(checkins);
    fillMyPlaces(places);
}
checkCookie();