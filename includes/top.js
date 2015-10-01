savedPosition = false;

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

function savePosition(position){
	if( savedPosition === false )
		savedPosition = position;
	if( savedPosition.coords.latitude == 0 && window.location.hash != "#reloaded") {
		window.location.hash = "#reloaded";
		location.reload();
	}
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, getLocation);
    } else {
        setTimeout( "getLocation()", 0 );
    }
}

getLocation();

window.addEventListener( "load" , getLocation );
