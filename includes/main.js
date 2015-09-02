var yafaKey = "obmZctGH4sM63Kcg5nSuudbe45Cy7ad7RCD1mTxP";

$(function() {

  Parse.$ = jQuery;

  // Initialize Parse with your Parse application javascript keys
  Parse.initialize("3qSCOtlV3fKxHclzVynVo0D0MAskpZGQtiSezvoC",
                   "u0zknx06v36GMpZB5dyiGvK8Ss5P68WzIUFAaCgv");
                   
  $(document).trigger('parseload');
                   
	 window.fbAsyncInit = function() {
    Parse.FacebookUtils.init({ // this line replaces FB.init({
      appId      : '405245006352397', // Facebook App ID
      status     : true,  // check Facebook Login status
      cookie     : true,  // enable cookies to allow Parse to access the session
      xfbml      : true,  // initialize Facebook social plugins on the page
      version    : 'v2.3' // point to the latest Facebook Graph API version
    });

        // Run code after the Facebook SDK is loaded.
         $(document).trigger('fbload');
  };

      (function(d, s, id){
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {return;}
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
  }(document, 'script', 'facebook-jssdk'));      


	
});


function getAllMusicGeneres(onSuccess, onFail){
	var MusicGenere = Parse.Object.extend("MusicGenere");
	var query = new Parse.Query(MusicGenere);
	query.find({
	  success: function(results) {
	  	onSuccess(results);
	  },
	  error: function(error) {
	  	onFail(error);
	  }
	});
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


function getPlace(id, onSuccess, onFail){
	var Place = Parse.Object.extend("Place");
	var query = new Parse.Query(Place);
	query.get(id, {
	  success: function(results) {
	  	onSuccess(results);
	  },
	  error: function(error) {
	  	onFail(error);
	  }
	});
}

function getAllPlacesTypes(onSuccess, onFail){
	var PlaceType = Parse.Object.extend("PlaceType");
	var query = new Parse.Query(PlaceType);
	query.find({
	  success: function(results) {
	  	onSuccess(results);
	  },
	  error: function(error) {
	  	onFail(error);
	  }
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


function savePosition(position){
	savedPosition = position;
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("User denied the request for Geolocation.");
            break;
        case error.POSITION_UNAVAILABLE:
           // alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
            alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, showError);
    } else {
        // TODO:
    }
}

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
	FB.api('/me', function(response) {
	  Parse.User.current().save({
	    displayName: response.name
	  },
	  {
	    success: function(gameTurnAgain) {
		    window.location.assign("main.html");
	        // update ui
	    },
	    error: function(gameTurnAgain, error) {
	        // update ui
	        }
	      });
  });
}
getLocation();
