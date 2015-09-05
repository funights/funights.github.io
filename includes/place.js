var place;
var user;

$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(res){
		var query = new Parse.Query(Parse.User);
		var userId = getCookie("userid");
		query.get(userId, {
			success: function(cUser){
				user = cUser;
			}
		});
		
        getPlace(getParameterByName("id"), function(res){
        	// take the first 5 places
			var template = $("#placePageId").html();
			var compiled = _.template(template);
			place = res;
			getComments();
			init();

			//$("#placeTarget").html(compiled({item:res}));
	        }, function(error){
	        	//error
	        });
	        
	    //some code that requires the parse object
		$('#add-comment').submit(function(e) {
	        //on form submit
	        e.preventDefault();
	        var Comment = Parse.Object.extend('Comment');
	        var newComment = new Comment();
			  // The file has been saved to Parse.
			  
			  //match the key values from the form, to your parse class, then save it
			  var data = {
	            comment: $("#commentInput").val(),
	            user: user,
	            place: place
	        };
	        newComment.save(data, {
	                //if successful
	                success: function(parseObj) {
	                		alert("success");
	                		$("#commentInput").val("");
	                		getComments();
	                    },
	                error: function(parseObj, error) {
	                    console.log(parseObj);
	                    console.log(error);
	                }
	            }
	        );
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
		 	 		if (results[j].get("objectID") === place.get("tags")[i])
		 	 			addToTagsList(results[j].get("name"));
		 	 		else 
		 	 			addToSelectTags(results[j].get("name"));
	 	 		}
		  	}
	  	} else{
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
	var CheckIn = Parse.Object.extend('CheckIn');
	var newCheckIn = new CheckIn();
	var data = {
        user: user,
        place: place,
        when: new Date(),
    };
    if (!user || !place){
    	alert("missing user id place id");
    	return;
    }
    newCheckIn.save(data, {
            //if successful
            success: function(parseObj) {
            	alert("תהנה! הרווחת עוד 20 נקודות");
                }
            ,
            error: function(parseObj, error) {
                console.log(parseObj);
                console.log(error);
            }
        }
    );
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

function getComments(){
	var Comment = Parse.Object.extend('Comment');
	var query = new Parse.Query(Comment);
	query.include("user");
	query.include("place");
	query.equalTo("place", place);
	query.descending("createdAt");
	query.limit(10);
	query.find({
	  success: function(results) {
	  	fillComments(results);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function fillComments(res){
	for (var i=0; i < res.length; i++) {
	  var commentObj = res[i];
	  var when = commentObj.createdAt.format("dd/m/yy HH:MM");
	  $("#comments").append("<div>" + commentObj.get("user").get("displayName")  +"<span> - "+ when + "</span>"+ "</div>" + "<div>"+ commentObj.get("comment")+ "</div>");
	};
}