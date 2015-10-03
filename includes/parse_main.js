var user;
function getPlacesSuccess(res){
	// Calculate the distance for all places from the user
	for (i = 0; i < res.length; i++) { 
		var place = res[i];
		var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
		place.dis = dis;
		
        if (place.get("placePic")){
            place.imageUrl = place.get("placePic").url();
        } else {
            place.imageUrl = "";
        }
		console.log(place.get("name")  + " " + dis);
	}
	// sotring the places by distance
	res.sort(function(a,b){return a.dis - b.dis});
	// take the first 5 places
	var closePlaces = res.slice(0, 5);
	var template = $("#placesList").html();
	var compiled = _.template(template);
	
	$("#target").html(compiled({items:closePlaces}) );
}
$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR

    function() {
    	if( window.location.href.split( "main" ).length > 1 )
    		onPageLoad();
		showHelloUser();
    }
);

function onPageLoad(){
    //some code that requires the parse object
	
	getAllPlacesTypes(function(res){
		if( $("#filterTarget").length > 0 ) {
			var template = $("#filterList").html();
			var compiled = _.template(template);
		
			$("#filterTarget").html(compiled({items:res}));
		}
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

}

function showHelloUser() {
	    
    var query = new Parse.Query(Parse.User);
	var userId = getCookie("userid");
	if (userId){
		query.get(userId, {
			success: function(cUser){
				user = cUser;
				$("#helloUser").html("Hello, " + user.get("displayName"));
			}
		});
	}
}

function onChangeFilter(){ // when changing MusicGenere or PlaceType filter run again the query
	$("#target").html("Loading...");
	getAllPlaces(getPlacesSuccess, function(error){
		alert(error);
	});
}

function getAllPlaces(onSuccess, onFail){
	var Place = Parse.Object.extend("Place");
	var query = new Parse.Query(Place);
	var placeType = $("#filterTarget option:selected").val();
	var musicGenere = $("#filterMusicTarget option:selected").val();
	if (musicGenere && musicGenere != "0"){
		query.equalTo("musicGenere", musicGenere);
	}
	if (placeType && placeType != "0"){
		query.equalTo("type", placeType);
	}
	query.find({
	  success: function(results) {
	  	onSuccess(results);
	  	addLandscapeImageClass();
	  },
	  error: function(error) {
	  	onFail(error);
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}
var savedPosition;

Number.prototype.toRad = function() { return this * (Math.PI / 180); };
function calcDistance(lat2, lon2){
	getLocation();
	alert(savedPosition.coords.latitude);
    if (!savedPosition){
        return 0;
    }
    var lat1 = savedPosition.coords.latitude;
    var lon1 = savedPosition.coords.longitude;
    var R = 6371; // km
    var dLat = (lat2-lat1).toRad();
    var dLon = (lon2-lon1).toRad();
    var lat1 = lat1.toRad();
    var lat2 = lat2.toRad();

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}

function fillHighRankedPlaceContent(place, rating){
    $("#placeName").html(place.get("name"));
    $("#asideDescription"  ).html(place.get("description"));
    setTypeAside(place.get("type"));
    setImagesMainPage(place);
    rating = Math.round( rating );
    $("#star" + rating).prop("checked", true);
}