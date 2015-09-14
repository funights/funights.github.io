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
    for(var i=0; i<results.length; i++){
        var user = results[i];
        var div = $("<div class='userClass'></div>");
        var img = $( "<img src='http://graph.facebook.com/" + user.get("facebookId") + "/picture?type=normal'/>");
        div.append(img);
        div.append($('<h2 class="myScoreH">הניקוד שלי:</h2>'));
        div.append($('<h1 class="userScore">' + user.get("score") + '</h1>'));
         div.append($('<h1 class="userName">' + user.get("displayName") + '</h1>'));
        $("#scores").append(div);
    }
}