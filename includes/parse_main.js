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
	    
	    getAllPlaces(function(res){
	    	// Calculate the distance for all places from the user
	    	for (i = 0; i < res.length; i++) { 
	    		var place = res[i];
	    		var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
	    		place.dis = dis;
	    		console.log(place.get("name") + " " + dis);
			}
			// sotring the places by distance
			res.sort(function(a,b){return a.dis - b.dis});
			// take the first 3 places
			var closePlaces = res.slice(0, 3);
			var template = $("#placesList").html();
			var compiled = _.template(template);
			
			$("#target").html(compiled({items:closePlaces}));
		}, function(error){
			alert(error.message);
		});
	
});

function onChangeFilter(){ // when changing MusicGenere or PlaceType filter run again the query
	$("#target").html("Loading...");
	getAllPlaces(function(res){
		var template = $("#placesList").html();
		var compiled = _.template(template);
		
		$("#target").html(compiled({items:res}));
	}, function(error){
		alert(error);
	});
}
