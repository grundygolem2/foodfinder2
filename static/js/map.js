function initMap() {
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                        function(position){
                                renderMap(position.coords.latitude, position.coords.longitude);
                        });
        }
        else{
                alert("Geolocation Error");

        }
}


function renderMap(lat, lng)
{
        myPos =new google.maps.LatLng(lat, lng);
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
                request.open("GET", "/getEventsJSON?lat=" + lat + "&lon=" + lng + "&maxdist=" + 1, true);
                request.send(null);

}                
