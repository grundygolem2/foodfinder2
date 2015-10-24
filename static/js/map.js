
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
                var request = new XMLHttpRequest();
                request.onreadystatechange = function(){
                        if (request.readyState == 4 && request.status == 200) {
                                data = JSON.parse(request.responseText);
                                parseData(data);
                        };
                request.open("GET", "/getEventsJSON", true);
                request.send("lat=" + lat + "&lon=" + lng + "&maxdist=" + 1);
                //parseData([{"lon": -71.118617, "lat": 42.406351, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.0809815658574988, "loc_help": "", "address": "", "name": "BBQ On Librarygregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": "", "endtime": "2015-10-25 00:52:42"}, {"lon": -71.118617, "lat": 42.406351, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.0809815658574988, "loc_help": null, "address": null, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.118617, "lat": 42.406351, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.0809815658574988, "loc_help": null, "address": null, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.118617, "lat": 42.406351, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.0809815658574988, "loc_help": null, "address": null, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.1186166, "lat": 42.4063509, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.08099346930910986, "loc_help": null, "address": "", "name": "BBQ On Library Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.1186166, "lat": 42.4063509, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.08099346930910986, "loc_help": null, "address": null, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.1186166, "lat": 42.4063509, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.08099346930910986, "loc_help": null, "address": null, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.1186166, "lat": 42.4063509, "desc": "Getcha books 'ere. I mean ribs. Ribs.", "dist": 0.08099346930910986, "loc_help": null, "address": null, "name": "BBQ On LibraryNULLSTUFFgregrew Roof", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.1210306, "lat": 42.4071273, "desc": "Celebrate Tony Monaco's Bday with free food stuffs", "dist": 0.10535053741237589, "loc_help": null, "address": "", "name": "Monaco's Birthday BBQ", "starttime": "2015-10-24 00:55:30", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.1169214, "lat": 42.4060103, "desc": "Come be an engineer. Or not. Just take food I guess.", "dist": 0.14787181780675954, "loc_help": null, "address": "", "name": "Engineering Open House", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.0662599, "lat": 42.4251074, "desc": "Malden is further away than stuff on Tufts campus.", "dist": 2.954215506007708, "loc_help": null, "address": "", "name": "Malden Food fest", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -71.054265, "lat": 42.3642395, "desc": "In North End", "dist": 4.455564467489935, "loc_help": null, "address": "", "name": "Free Mike's Pastries", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}, {"lon": -3.554265, "lat": 41.1844553, "desc": "Very very far. Should never show up in local Boston queries.", "dist": 3385.278910357013, "loc_help": null, "address": "", "name": "Yummy Spanish food in Spain", "starttime": "2015-10-22 23:59:00", "tags": null, "endtime": "2015-10-25 00:52:42"}]);

}                