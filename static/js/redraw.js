function redrawMap(lat, lng)
{
        myPos = new google.maps.LatLng(lat, lng);
        map.panTo(myPos);
        var request = new XMLHttpRequest();
        request.onreadystatechange = function()
        {
                if (request.readyState == 4 && request.status == 200) {
                        data = JSON.parse(request.responseText);
                        clearMarkers();
                        parseData(data);
                        populateTable(data);
                }
        };
        request.open("GET", "/getEventsJSON?lat=" + lat + "&lon=" + lng + "&maxdist=" + 1, true);
        request.send(null);
}

function clearMarkers()
{
        for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
        }
        markers = [];
}