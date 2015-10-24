
function parseData(data)
{
        
        //var locations = JSON.parse(data);
        markers = [];
        for(var i = 0; i < data.length; i++){
                var pos = new google.maps.LatLng(data[i].lat, data[i].lon);
                markers.push(new google.maps.Marker({
                        position: pos,
                        title: data[i].name + " described as " + data[i].desc
                }));

                markers[i].setMap(map);

        }
}