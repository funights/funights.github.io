var autocomplete;
var address;
var fileUrl;
var user;
window.onload = function() {
	setTimeout( function() { initAutocomplete(); }, 300 );
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

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress(){
	var place = autocomplete.getPlace();
	console.log(place);
}

// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var geolocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };
      var circle = new google.maps.Circle({
        center: geolocation,
        radius: position.coords.accuracy
      });
      autocomplete.setBounds(circle.getBounds());
    });
  }
}

$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(){
        var query = new Parse.Query(Parse.User);
		var userId = getCookie("userid");
		query.get(userId, {
			success: function(cUser){
				user = cUser;
			}
		});
		getAllPlacesTypes(function(res){
			var template = $("#placeTypeList").html();
			var compiled = _.template(template);
			
			$("#placeType").html(compiled({items:res}));
		}, function(error){
			alert(error.message);
		});
		
		getAllMusicGeneres(function(res){
			var template = $("#musicGenereList").html();
			var compiled = _.template(template);
			
			$("#musicGenere").html(compiled({items:res}));
		}, function(error){
			alert(error.message);
		});
		
	    //some code that requires the parse object
		$('#add-place').submit(function(e) {
	        //on form submit
	        e.preventDefault();
	        
	        //get data from form
	        var placeObj = autocomplete.getPlace();
	        if (!placeObj || !placeObj.geometry){
	        	alert("Please choose location from list");
	        	return;
	        }
	        var geoPoint    = new Parse.GeoPoint({ latitude: placeObj.geometry.location.lat(), longitude: placeObj.geometry.location.lng() });
			var placeType   = $("#placeType option:selected").val();
			var musicGenere = $("#musicGenere option:selected").val();

			var fileUploadControl = $("#upload")[0];
			if (!fileUploadControl.files || fileUploadControl.files == 0){
				alert("Please upload a file");
				return;
			}

			var file     = fileUploadControl.files[0];
			var unixTime = (new Date().getTime());
			var ext      = file.name.split(".");
			var ext      = ext[ext.length-1];
			var name     = unixTime+"."+ext;

  			var parseFile = new Parse.File(name, file);
  			
	
	        //create new Parse object
	        var Place = Parse.Object.extend('Place');
	        var newPlace = new Place();
			parseFile.save().then(function() {
			  // The file has been saved to Parse.
			  
			  //match the key values from the form, to your parse class, then save it
				  var data = {
		            name: $("#placeName").val(),
		            type: placeType,
		            musicGenere: musicGenere,
		            address: $("#autocomplete").val(),
		           	description: $("#placeDescription").val(),
		           	address_geo: geoPoint,
		           	placePic: parseFile,
                    userAdded: user
		        };
		        
		        newPlace.save(data, {
		                //if successful
		                success: function(parseObj){
                            var score = user.get("score") ? user.get("score") : 0 ;
                            user.set("score", score + 20);
                                user.save();
                                jqAlert("תהנה ! הרווחת 20 נקודות", "placePage.html?id=" + parseObj.id);
		                    }
		                ,
		                error: function(parseObj, error) {
		                    console.log(parseObj);
		                    console.log(error);
		                }
		            }
		        );
			}, function(error) {
			  // The file either could not be read, or could not be saved to Parse.
			});				
	
	        
	    });
});
checkCookie();