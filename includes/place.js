var place;

$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
        getPlace(getParameterByName("id"), function(res){
        	// take the first 5 places
			var template = $("#placePageId").html();
			var compiled = _.template(template);
			place = res;
			init();
			//$("#placeTarget").html(compiled({item:res}));
	        }, function(error){
	        	//error
	        });
});

function init(){
	// clear data before retrieving new
	var Place = Parse.Object.extend("Place");
	var query = new Parse.Query(Place);
	query.get(place.id, {
	  success: function(place) {
		fillPlaceContent(place);
	  },
	  error: function(object, error) {
	    // The object was not retrieved successfully.
	    // error is a Parse.Error with an error code and message.
	  }
	});
}

function fillPlaceContent(){
  		$("#placePageName").html(place.get("name"));
	   	$("#description").html(place.get("description"));
	   	var imageDiv = $("#placePagePic");
	   	var url = place.get("placePic").url();
	   	var image = $("<img src="+ url + ">");
	   	imageDiv.append(image);
	   	getTags(place);
	   	setType(place.get("type"));
}

function setType(typeId){
	var PlaceType = Parse.Object.extend("PlaceType");
	var query = new Parse.Query(PlaceType);
	query.get(typeId,{
		success: function(type){
		console.log('ptype', type);
		 $('#placePageType').html(type.get('name'));
		},
	  error: function(object, error) {
	    console.debug('error',error);
	  }
	});
}

function getTags(place){
	var Tag = Parse.Object.extend("Tag");
	var query = new Parse.Query(Tag);
	query.find({
	  success: function(results) {
	  	if(place.get("tags")){
		  	for (var i=0; i < place.get("tags").length ; i++){
		 	 	for (var j=0; j<results.length; j++){
		 	 		if (results[j].get("name") === place.get("tags")[i])
		 	 			addToTagsList(results[j].get("name"));
		 	 		else 
		 	 			addToSelectTags(results[j].get("name"));
	 	 		}
		  	}
	  	}else{
	  		for(var i=0 ; i< results.length; i++)
	  			addToSelectTags(results[i].get("name"));
	  	}
	  },
	  error: function(error) {
    alert("Error: " + error.code + " " + error.message); 
  }
});
	
}

function checkIn(){
	
}

function addPlacePic(){
	
}

function addToTagsList(name){
	var tagsDiv = $("#tags");
	var newDiv = $('<div id='+ name +' class="tagsClass"></div>');
	var a= $('<a onclick=removeTag(' + name + ')></a>');
	a.html(name);
	newDiv.append(a);
	tagsDiv.append(newDiv);
}

function removeTag(name){
	$('#'+name).remove();
	//remove from parse list
	place.remove('tags', name);
	place.save();	
}

function addToSelectTags(name){
	var selectMenu = $('#chooseTag');
	var option = $('<option value='+ name +'>'+ name +'</option>');
	selectMenu.append(option);
}