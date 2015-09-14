$(document).on(
	'parseload',  //  <---- HERE'S OUR CUSTOM EVENT BEING LISTENED FOR
	function(){
	    //some code that requires the parse object
		getTopScorers();

});


function getTopScorers(){
	var query = new Parse.Query(Parse.User);
    query.descending("score");
    query.limit(5);
    query.find({
       success: function(results){
            fillTopScorers(results);
       },
       error: function(obj, error){
            console.log(obj);
            console.log(error);
       }
    });
}

function fillTopScorers(results){
    for(var i=0; i<5; i++){
        var user = results[i];
        var div  = $("<div class='userClass'></div>");
        var img  = $( "<img src='http://graph.facebook.com/" + user.get("facebookId") + "/picture?type=normal'/>");
        div.append(img);
        div.append($('<h3 class= "userName">שם: ' 	+ user.get("displayName") + '</h3>'));
        div.append($('<h3 class= "userScore">ניקוד: '	+ user.get("score"      ) + '</h3>'));
  
        $("#scores").append(div);
    }
}