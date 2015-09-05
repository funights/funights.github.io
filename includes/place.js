var place;
var user;

window.onload = function() {
	setImageForm();
    var fileInput = document.getElementById('upload');
    var holder    = document.getElementById('fileDisplayArea');

    fileInput.addEventListener('change', function(e) {
      // Put the rest of the demo code here.
	  e.preventDefault();
	
	  var file = upload.files[0],
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
	           	placePic: parseFile
	        };
	        
			newPlaceImage.save(data, {
			                //if successful
			                success: function(parseObj) {
			                		setImages();
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
	   	getTags(place);
	   	setType(place.get("type"));
	   	setImages();
}

function setImages() {
   	var imageDiv = $("#placePagePic");
   	var url = place.get("placePic").url();
   	var image = $("<img src="+ url + ">");
   	imageDiv.append(image);
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
	$( "#tags" ).html("");
	$( "#chooseTag" ).html( "<option value=''>בחר תגית ▼</option>");
	
	var Tag = Parse.Object.extend("Tag");
	var query = new Parse.Query(Tag);
	query.find({
	  success: function(allTags) {
	  	var addRows    = {};
	  	if(place.get("tags")){
	  		var tags = place.get("tags");

		  	for (var i=0; i < tags.length ; i++)
		 	 	addRows[tags[i]] = tags[i];
		  	
		  	for (var i=0; i < allTags.length ; i++) {
		  		var isSelected = (typeof( addRows[allTags[i].id] ) != "undefined");
	 	 		if ( isSelected )
	 	 			addToTagsList( allTags[i].get("name") , allTags[i].id );
	 	 		else 
	 	 			addToSelectTags(allTags[i].get("name"), allTags[i].id);
 	 		}
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


function addToTagsList(name, id){
	var tagsDiv = $("#tags");
	var newDiv  = $('<div class="tagsClass"></div>');
	var a       = $('<a onclick="removeTag(this)" data-id="'+id+'"></a>');
	var span    = $('<span></span>');
	span   .html(name);
	a      .html("-");
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

	tags[ tags.length ] = id;
	place.set( "tags", tags );
	place.save();	
	getTags(place);

}

function addToSelectTags(name, id ){
	var selectMenu = $('#chooseTag');
	var option = $('<option data-id="'+id+'">'+ name +'</option>');
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