// setCookie('userid', "mA22yn2H4x" );
$(function() {
  
  if( !getCookie("userid") && window.location.href.split( "index").length == 1 ){
  	window.location = "index.html";
  }
  
  if( getCookie("userid") && $( "#fblogin" ).length > 0 ){
  	window.location = "main.html";
  }  
  
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


	$("location").on("click", getLocation);
});


window.addEventListener( "load", addLandscapeImageClass );

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
        	if( !getCookie( 'approvedLocation' )) {
            	alert("בבקשה אפשר גישה לשירותי מיקום");
            	setCookie( 'approvedLocation', 'true' );
           }
            break;
        case error.POSITION_UNAVAILABLE:
           // alert("Location information is unavailable.");
            break;
        case error.TIMEOUT:
           // alert("The request to get user location timed out.");
            break;
        case error.UNKNOWN_ERROR:
          //  alert("An unknown error occurred.");
            break;
    }
}

function getLocation(){
    if (navigator.geolocation) {
    	$("#changePositionField").html("style=diaplay:block;"); 
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
	    displayName: response.name,
	    facebookId: response.id,
	    score: 0
	  },
	  {
	    success: function(gameTurnAgain) {
	    	setCookie('userid', Parse.User.current().id, 100);
		    window.location.assign("main.html");
	        // update ui
	    },
	    error: function(gameTurnAgain, error) {
	        // update ui
	        }
	      });
  });
}

function setCookie(cname, cvalue, exdays) {
     var d = new Date();
     d.setTime(d.getTime() + (exdays*24*60*60*1000));
     var expires = "expires="+d.toUTCString();
     document.cookie = cname + "=" + cvalue + "; " + expires;
 }

 function getCookie(cname) {
     var name = cname + "=";
     var ca = document.cookie.split(';');
     for(var i=0; i<ca.length; i++) {
         var c = ca[i];
         while (c.charAt(0)==' ') c = c.substring(1);
         if (c.indexOf(name) == 0) return c.substring(name.length,c.length);
     }
     return "";
 }

 function checkCookie() {
     var user = getCookie("userid");
     if (user != "") {
         //stay on page
     } else {
         window.location.href="index.html";
     }
 }

 function removeCookie() {
      setCookie("userid", "", -1);
       //setting the userid to an empty string 
      //and setting the expiration time to have passed
 }
 
 
 /*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */



var dateFormat = function () {
    var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
        timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
        timezoneClip = /[^-+\dA-Z]/g,
        pad = function (val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len) val = "0" + val;
            return val;
        };

    // Regexes and supporting functions are cached through closure
    return function (date, mask, utc) {
        var dF = dateFormat;

        // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
        if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
            mask = date;
            date = undefined;
        }

        // Passing date through Date applies Date.parse, if necessary
        date = date ? new Date(date) : new Date;
        if (isNaN(date)) throw SyntaxError("invalid date");

        mask = String(dF.masks[mask] || mask || dF.masks["default"]);

        // Allow setting the utc argument via the mask
        if (mask.slice(0, 4) == "UTC:") {
            mask = mask.slice(4);
            utc = true;
        }

        var _ = utc ? "getUTC" : "get",
            d = date[_ + "Date"](),
            D = date[_ + "Day"](),
            m = date[_ + "Month"](),
            y = date[_ + "FullYear"](),
            H = date[_ + "Hours"](),
            M = date[_ + "Minutes"](),
            s = date[_ + "Seconds"](),
            L = date[_ + "Milliseconds"](),
            o = utc ? 0 : date.getTimezoneOffset(),
            flags = {
                d:    d,
                dd:   pad(d),
                ddd:  dF.i18n.dayNames[D],
                dddd: dF.i18n.dayNames[D + 7],
                m:    m + 1,
                mm:   pad(m + 1),
                mmm:  dF.i18n.monthNames[m],
                mmmm: dF.i18n.monthNames[m + 12],
                yy:   String(y).slice(2),
                yyyy: y,
                h:    H % 12 || 12,
                hh:   pad(H % 12 || 12),
                H:    H,
                HH:   pad(H),
                M:    M,
                MM:   pad(M),
                s:    s,
                ss:   pad(s),
                l:    pad(L, 3),
                L:    pad(L > 99 ? Math.round(L / 10) : L),
                t:    H < 12 ? "a"  : "p",
                tt:   H < 12 ? "am" : "pm",
                T:    H < 12 ? "A"  : "P",
                TT:   H < 12 ? "AM" : "PM",
                Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
            };

        return mask.replace(token, function ($0) {
            return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
        });
    };
}();

// Some common format strings
dateFormat.masks = {
    "default":      "ddd mmm dd yyyy HH:MM:ss",
    shortDate:      "m/d/yy",
    mediumDate:     "mmm d, yyyy",
    longDate:       "mmmm d, yyyy",
    fullDate:       "dddd, mmmm d, yyyy",
    shortTime:      "h:MM TT",
    mediumTime:     "h:MM:ss TT",
    longTime:       "h:MM:ss TT Z",
    isoDate:        "yyyy-mm-dd",
    isoTime:        "HH:MM:ss",
    isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
    isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
    dayNames: [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
    monthNames: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
        "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
    return dateFormat(this, mask, utc);
};

getLocation();
function logout(){
    Parse.User.logOut();
    removeCookie();
    window.location.assign("index.html");
}

function fillRating(result){
	if (result) {
		var ratingSum=0;
		var rating;
		for (var i=0; i < result.length; i++) {
		  ratingSum += result[i].get("rating");
		};
			rating= ((ratingSum/result.length));
	};
}

function getHighestRating(rating){
	var Rating = Parse.Object.extend('Rating');
	var query = new Parse.Query(Rating);
	var max;
	query.include("user");
	query.include("place");
	query.find({
	  success: function(results) {
        var ratingPlace = {};
        var numPlaces = {};
        var places = {};
        var max = -1;
        var highestPlace;
        for(var i=0; i<results.length; i++){
            var rating = results[i];
            var place = rating.get("place");
            if (place) {
                var placeId = place.id;
                if (!ratingPlace[placeId]) {
                    places[placeId] = place;
                    ratingPlace[placeId] = 0;
                    numPlaces[placeId] = 0;
                }
                ratingPlace[placeId] += rating.get("rating");
                numPlaces[ placeId] += 1;
            }
        }

        for (var placeId in ratingPlace) {
            var placeAvg = ratingPlace[placeId] / numPlaces[placeId];
            if (placeAvg > max){
                max = placeAvg;
                highestPlace = placeId;
            }
        }
        fillHighRankedPlaceContent(places[highestPlace], max);
	  },
	  error: function(error) {
	    // alert("Error: " + error.code + " " + error.message);
	  }
	});
}

function setImages(place) {
   	var imageDiv = $("#placePagePic");
   	var url = place.get("placePic").url();
   	var image = $("<a href='placePage.html?id=" + place.id + "'><img id='pic' src="+ url + "></a>");
   	imageDiv.html(image);

   	placePictures = [];
   	placePictures.push(url);
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

function addLandscapeImageClass() {
	$( "img" ).each(function() {
		if( this.offsetWidth > this.offsetHeight )
			$( this ).addClass( "landscapeImage" );
	});
}

window.addEventListener( "load", showUserImage );
function showUserImage() {
	var userId = getCookie("userid");
	var query = new Parse.Query(Parse.User);
	query.get(userId, {
		success: function(cUser){
			var img = $( "<a href='myPage.html'><img src='http://graph.facebook.com/"+cUser.get( "facebookId" )+"/picture?type=normal'></a>");
			$( "#helloUser" ).prepend( img );
		} 
	} );
}

function jqAlert( msg, url, buttonText ) {
	if(typeof( buttonText) == "undefined" )
		buttonText = "אישור";
    
    buttons = {};
    buttons[buttonText] = function() 
        {
        	if( typeof( url ) != "undefined" ) {
        		window.location = url;
        	} else
            $( this ).dialog( "close" );
        };
    
    $("<div></div>").html(msg).dialog({
        title: "",
        resizable: false,
        modal: true,
        buttons: buttons
    });
}

function loadAfter( objName, func ) {
	eval( "obj = "+objName+";")
	if( typeof( obj ) == "undefined" ) {
		setTimeout( function() {
			loadAfter( objName, func )
		}, 300 );
	} else {
		eval( func+"();" );
	}
}
