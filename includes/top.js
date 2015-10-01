savedPosition = false;

function showError(error) {
	alert( error.code );

}

function savePosition(position){
	if( savedPosition === false )
		savedPosition = position;
		
	if( savedPosition.coords.latitude > 0 ) {
		setCookie( "lat", savedPosition.coords.latitude );
		setCookie( "lon", savedPosition.coords.longitude );
	} else if( getCooke( "lat" ) ) {
		savedPosition.coords.latitude  = getCooke( "lat" );
		savedPosition.coords.longitude = getCooke( "lon" );
	}
	alert( savedPosition.coords.latitude ) ;
}

function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, showError);
    } else {
      //  setTimeout( "getLocation()", 0 );
      alert( "no navigator" );
    }
}

getLocation();

//window.addEventListener( "load" , getLocation );
