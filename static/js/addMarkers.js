
function parseData(data)
{
        
        //var locations = JSON.parse(data);
        for(var i = 0; i < data.length; i++){
                var pos = new google.maps.LatLng(data[i].lat, data[i].lon);
                var descrip = data[i].name + " described as " + data[i].desc;

                makeInfowindows(pos, descrip);
        }
}

function makeInfowindows(pos, description)
{
        var marker;
        var infowindow;
        marker = new google.maps.Marker({
                position: pos,
                title: description
        });

        marker.setMap(map);
        infowindow = new google.maps.InfoWindow({content: marker.title});
        google.maps.event.addListener(marker, 'click', function() {
                infowindow.close();
                infowindow.open(map, this);
                });
}