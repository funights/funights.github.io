function getLocation(){
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(savePosition, showError);
        var savedPosition = savePosition;
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
    } else {
        // TODO:
   }
}
