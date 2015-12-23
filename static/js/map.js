
function initMap() {
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                        function(position){
                                renderMap(position.coords.latitude, position.coords.longitude);
                        });
        }
        else{
                alert("No Geolocation");
        }
}


function renderMap(lat, lng)
{
        myPos = new google.maps.LatLng(lat, lng);
        map = new google.maps.Map(document.getElementById("map"),
                {center: new google.maps.LatLng(12,12),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP});
                map.panTo(myPos);
                var request = new XMLHttpRequest();
                request.onreadystatechange = function()
                {
                        if (request.readyState == 4 && request.status == 200) {
                                data = JSON.parse(request.responseText);
                                parseData(data);
                                populateTable(data);
                        }
                };
                var today = new Date();
		var dd = today.getDate();
		var mm = today.getMonth()+1; //January is 0!
		var yyyy = today.getFullYear();
		if(dd<10){
			dd='0'+dd;
		}
		if(mm<10){
			mm='0'+mm;
		}
		var date = yyyy+'-'+mm+'-'+dd;
		var hh = today.getHours();
		var mn = today.getMinutes();
		if(hh<10){
			hh='0'+hh;
		}
		if(mn<10){
			mn='0'+mn;
		}
	        var time = hh+":"+mn+":00";

                curtime= date + ' ' + time;
                request.open("GET", "/getEventsJSON?lat=" + lat + "&lon=" + lng + "&maxdist=" + 1 + "&time="+curtime, true);
                request.send(null);

}
