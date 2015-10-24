
function initMap() {
        if(navigator.geolocation){
                navigator.geolocation.getCurrentPosition(
                        function(position){
                                renderMap(position.coords.latitude, position.coords.longitude);
                        });
        }
        else{
                alert("No Geolocation So fuck you");
        }
}


function renderMap(lat, lng)
{
        myPos =new google.maps.LatLng(lat, lng);
        map = new google.maps.Map(document.getElementById("map_canvas"),
                {center: new google.maps.LatLng(12,12),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP});
                map.panTo(myPos);
                /*var request = new XMLHttpRequest();
                request.onreadystatechange = function()
                {
                        if (request.readyState == 4 && request.status == 200) {
                                data = JSON.parse(request.responseText);
                                parseData(data);
                                populateTable(data);
                        }
                };
                request.open("GET", "/getEventsJSON", true);
                request.send("lat=" + lat + "&lon=" + lng + "&maxdist=" + 1);
                */
                parseData([{"address": "", "desc": "Getcha books 'ere. I mean ribs. Ribs.", "lat": 42.406351, "endtime": "2015-10-25 00:52:42", "starttime": "2015-10-22 23:59:00", "tags": "", "lon": -71.118617, "name": "BBQ On Librarygregrew Roof", "loc_help": ""}, {"address": null, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "lat": 42.406351, "endtime": "2015-10-25 00:52:42", "starttime": "2015-10-22 23:59:00", "tags": null, "lon": -71.118617, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "loc_help": null}, {"address": null, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "lat": 42.406351, "endtime": "2015-10-25 00:52:42", "starttime": "2015-10-22 23:59:00", "tags": null, "lon": -71.118617, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "loc_help": null}, {"address": null, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "lat": 42.406351, "endtime": "2015-10-25 00:52:42", "starttime": "2015-10-22 23:59:00", "tags": null, "lon": -71.118617, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "loc_help": null}, {"address": "", "desc": "Getcha books 'ere. I mean ribs. Ribs.", "lat": 42.4063509, "endtime": "2015-10-25 00:52:42", "starttime": "2015-10-22 23:59:00", "tags": null, "lon": -71.1186166, "name": "BBQ On Library Roof", "loc_help": null}]);
                //populateTable(data)
}                