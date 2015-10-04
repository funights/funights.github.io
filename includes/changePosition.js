var autocomplete;

$(document).ready(function(){
//    setTimeout( function() { initAutocomplete(); }, 1000 );
    $('#changePosition').click(function(e){
        e.preventDefault();
        $("#changePositionField").show();
    });
});

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.

  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', changeUserPosition);
    $("#changePositionField").hide();
}

function changeUserPosition(){
    var placeObj = autocomplete.getPlace();
    savedPosition = {
        coords: {
            latitude : placeObj.geometry.location.lat(),
            longitude: placeObj.geometry.location.lng()
        }
    };
	console.log(placeObj);
    getAllPlaces(getPlacesSuccess, function(error){
        alert(error.message);
    });
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