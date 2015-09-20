var place;
var user;
var userRatingPlace;
var wasRating = false;
var placePictures = [];

window.onload = function() {
	setImageForm();
    var fileInput = document.getElementById('upload');
    var holder    = document.getElementById('fileDisplayArea2');

    fileInput.addEventListener('change', function(e) {
      // Put the rest of the demo code here.
	  e.preventDefault();
	
	  var file = upload.files[0]
      reader = new FileReader();
	  reader.onload = function (event) {
	    var img = new Image();
	    img.src = event.target.result;
	    // note: no onload required since we've got the dataurl...I think! :)
	    if (img.width > 560) { // holder width
	      img.width = 560;
	    }
	    holder.innerHTML = '';
	    holder.appendChild(img);
	  };
	  reader.readAsDataURL(file);
	
	  return false;
    });
}

function setImageForm() {
	$('#add-image').submit( function(e) {
        //on form submit
        e.preventDefault();
        
        //create new Parse object
        var PlaceImage    = Parse.Object.extend('PlaceImage');
        var newPlaceImage = new PlaceImage();
        
    	var fileUploadControl = $("#upload")[0];
		var file              = fileUploadControl.files[0];
		var unixTime          = (new Date().getTime());
		var ext               = file.name.split(".");
		var ext               = ext[ext.length-1];
		var name              = unixTime+"."+ext;

		var parseFile     = new Parse.File(name, file);
        
		parseFile.save().then(function() {
		  // The file has been saved to Parse.
		  
		  //match the key values from the form, to your parse class, then save it
			  var data = {
	            place:    place,
	            user: user,
	           	placePic: parseFile
	        };
	        
			newPlaceImage.save(data, {
			                //if successful
			                success: function(parseObj) {
                                setImages(place);
                                var score = user.get("score") ? user.get("score") : 0;
                                user.set("score", score + 10);
                                    user.save();
                                    $( "#fileDisplayArea2" ).hide();
                                    jqAlert("תהנה! הרווחת עוד 15 נקודות");
			                    }
			                ,
			                error: function(parseObj, error) {
			                    console.log(parseObj);
			                    console.log(error);
			                }
	        } );
		});	
	} );
}

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
	                		jqAlert("מעולה! הרווחת עוד 10 נקודות");
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
	   	$("#description"  ).html(place.get("description"));
	   	$('#address'      ).html(place.get("address"));
	   	getDistance(place);
	   	getTags(place);
	   	setType(place.get("type"));
	   	setImages(place);
	   	getUserRating();
	   	getRating();
	   	getPlaceImages();
}

var step=0;
function slideit()
{
    if (step >= placePictures.length){
    	step = 0;
    }
    
    $("#pic").attr("src", placePictures[step]);
    step++;
    setTimeout("slideit()", 2500);
}

function getPlaceImages(){
	var PlaceImage = Parse.Object.extend('PlaceImage');
	var query = new Parse.Query(PlaceImage);
	query.include("user");
	query.include("place");
	query.equalTo("place", place);
	query.equalTo("user", user);
	query.find({
	  success: function(results) {
	  	for (var i=0; i < results.length; i++) {
			placePictures.push(results[i].get("placePic").url());
		};
		slideit();
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function getDistance(place){
		   	var dis = calcDistance(place.get("address_geo").latitude, place.get("address_geo").longitude);
	        if (dis >= 1) {
	            dis = dis.toFixed(2) + " km";
	        } else {
	            dis = dis.toFixed(3) * 1000 + " m";
	        }
	        $('#distance').html(dis);
}

function getTags(place){
	$( "#tags" ).html("");
	$( "#chooseTag" ).html( "<option value=''>הוסף תגית לתיאור מקום  </option>");
	
	var Tag = Parse.Object.extend("Tag");
	var query = new Parse.Query(Tag);
	query.find({
	  success: function(allTags) {
	  	var addRows    = {};
  		var tags = place.get("tags");
  		
		if (tags != undefined){
		  	for (var i=0; i < tags.length ; i++)
		 	 	addRows[tags[i]] = tags[i];
		 	 }
		 	  	 
	  	for (var i=0; i < allTags.length ; i++) {
	  		var isSelected = (addRows[allTags[i].id] == undefined);
 	 		if ( isSelected )
 	 				addToSelectTags(allTags[i].get("name"), allTags[i].id);
 	 		else 
 					addToTagsList( allTags[i].get("name") , allTags[i].id );
 		}
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
                var score = user.get("score") ? user.get("score") : 0;
                user.set("score", score + 5);
                user.save();
                jqAlert("הרווחת 5 נקודות, השתמש בתגיות לתיאור המקום ותרוויח נקודות נוספות");
                var d = document.getElementById("checkinid");
                d.className = d.className + " pressed";
            },
            error: function(parseObj, error) {
                console.log(parseObj);
                console.log(error);
            }
    });
}


function addToTagsList(name, id){
	var tagsDiv = $("#tags");
	var newDiv  = $('<div class="tagsClass" id="'+id+'"></div>');
	var a       = $('<a onclick="removeTag(this)" data-id="'+id+'"></a>');
	var span    = $('<span></span>');
	span   .html(name);
	a      .html("   (-)");
	newDiv .append(a);
	newDiv .append(span);
	tagsDiv.append(newDiv);
}

function removeTag(a_obj){

	removeFromParseList();
	removeObject();
	refreshTags();
	
	function removeFromParseList() {
		var tags = place.get( "tags" );
		var id   = a_obj.dataset["id"];
		for( var i = 0; i < tags.length; i++ )
			if( tags[i] == id )
				tags.splice( i, 1 );
		place.set( "tags", tags );
		place.save();
		jqAlert("תודה, הרווחת עוד 5 רוצה לעשות לייק למקום?");	
	}
	
	function removeObject() {
		a_obj.parentNode.remove();
	}
	
	function refreshTags() {
		getTags(place);
	}
}

function addTag( selObj ){
	if( selObj.selectedIndex == 0 ) return;
	
	var selOption = selObj.options[selObj.selectedIndex];
	var tags      = place.get( "tags" );
	var id        = selOption.dataset["id"];
	if ( tags == null)
		tags = Array();
    if (tags.indexOf(id)>-1){
        return;
    }
	tags[ tags.length ] = id;
	place.set( "tags", tags );
	place.save();
    var score = user.get("score") ? user.get("score") : 0;
    user.set("score", score + 5);
    user.save();
    jqAlert("תודה, הרווחת עוד 5 נקודות. רוצה להוסיף גם תגובה משלך?");
	getTags(place);

}

function addToSelectTags(name, id ){
	var selectMenu = $('#chooseTag');
	var option = $('<option data-id="'+id+'">'+ name +'</option>');
	
	selectMenu.append(option);
}

function getUserRating(){
	var Rating = Parse.Object.extend("Rating");
	var query = new Parse.Query(Rating);
	console.log("user - " + user);
	console.log("place - " + place);
	query.include("user");
	query.include("place");
	query.equalTo("place", place);
	query.equalTo("user", user);
	query.find({
	  success: function(res) {
	  	if (res && res.length > 0){
			userRatingPlace = res[0];
			wasRating = true;
			$("#star" + userRatingPlace.get("rating")).prop("checked", true);
		}
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
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

function fillRating(result){
	if (result && result.length > 0) {
		var ratingSum=0;
		for (var i=0; i < result.length; i++) {
		  ratingSum += result[i].get("rating");
		};
		$("#allrating").html(Math.round(ratingSum/result.length) + " / " + result.length);
	} else{
        $("#currentRating").hide();
    }
}

function getRating(){
	var Rating = Parse.Object.extend('Rating');
	var query = new Parse.Query(Rating);
	query.include("user");
	query.include("place");
	query.equalTo("place", place);
	query.find({
	  success: function(results) {
	  	fillRating(results);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function rate(){
	var ratingScore = parseInt($('#rating input[type=radio]:checked').val());
	var Rating = Parse.Object.extend('Rating');
	
	if (!userRatingPlace){
		userRatingPlace = new Rating();
	}
	var data = {
        user: user,
        place: place,
        rating: ratingScore
    };
    if (!user || !place){
    	alert("missing user id place id");
    	return;
    }
    userRatingPlace.save(data, {
            //if successful
            success: function(parseObj) {
            	if (!wasRating){
                    var score = user.get("score") ? user.get("score") : 0;
                    user.set("score", score + 30);
                    user.save();
                    jqAlert("תהנה! הרווחת עוד 5 נקודות");
	            	wasRating = true;
            	}
            },
            error: function(parseObj, error) {
                console.log(parseObj);
                console.log(error);
            }
        }
    );
}
