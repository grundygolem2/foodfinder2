
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
        var myPos =new google.maps.LatLng(lat, lng);
        map = new google.maps.Map(document.getElementById("map_canvas"),
                {center: new google.maps.LatLng(12,12),
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP});
                map.panTo(myPos);
                alert("STUFF");
}