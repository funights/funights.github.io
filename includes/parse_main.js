var user;
function getPlacesSuccess(res){
	// Calculate the distance for all places from the user
	for (i = 0; i < res.length; i++) { 
		var place = res[i];
		var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
		place.dis = dis;
        if (place.get("placePic")){
            place.imageUrl = place.get("placePic").url()
        } else {
            place.imageUrl = ""
        }
		console.log(place.get("name") + " " + dis);
	}
	// sotring the places by distance
	res.sort(function(a,b){return a.dis - b.dis});
	// take the first 5 places
	var closePlaces = res.slice(0, 5);
	var template = $("#placesList").html();
	var compiled = _.template(template);
	
	$("#target").html(compiled({items:closePlaces}));
}
$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(){
	    //some code that requires the parse object
		
		getAllPlacesTypes(function(res){
			var template = $("#filterList").html();
			var compiled = _.template(template);
			
			$("#filterTarget").html(compiled({items:res}));
		}, function(error){
			alert(error.message);
		});
		
		getAllMusicGeneres(function(res){
			var template = $("#filterMusicList").html();
			var compiled = _.template(template);
			
			$("#filterMusicTarget").html(compiled({items:res}));
		}, function(error){
			alert(error.message);
		});   
	    
	    getAllPlaces(getPlacesSuccess, function(error){
			alert(error.message);
		});

        getHighestRating();
        
        var query = new Parse.Query(Parse.User);
		var userId = getCookie("userid");
		if (userId){
			query.get(userId, {
				success: function(cUser){
					$("#helloUser").html("Hello, " + user.get("displayName"));
					user = cUser;
				}
			});
		}
        
        
	
});

function onChangeFilter(){ // when changing MusicGenere or PlaceType filter run again the query
	$("#target").html("Loading...");
	getAllPlaces(getPlacesSuccess, function(error){
		alert(error);
	});
}

function fillHighRankedPlaceContent(place, rating){
    $("#placeName").html(place.get("name"));
    $("#asideDescription"  ).html(place.get("description"));
    setType(place.get("type"));
    setImages(place);
    rating = Math.round( rating );
    $("#star" + rating).prop("checked", true);
}