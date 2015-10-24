function postEvent() {
	console.log('in the function');
	document.body.addEventListener("latLonFound", finishPostEvent, false);
	var formData = document.getElementById("postform");
	console.log(formData);
	var parsedData = formData.split(/=|&/);
	var address;
	for (i = 0; i < parsedData.length(); i++) {
		//gets the address information to send to google or html geolocation
		if (parsedData[i] == 'address') { address = parsedData[i+1] }
	}
	if (address = 'My Location') {
		navigator.geolocation.getCurrentPosition(getCurLatLon(position, address, formData));
	} else {
	//(get lat/lon from address via google)
	getLatLon(address, formData);
	}
}
//listens for latLonFound, then executes
function finishPostEvent(e) {
	var eventObject = e.detail.fData + '&lat=' + e.detail.latitude + '&lon=' + e.detail.lon;
	JSON.stringify(eventObject);
	var request = new XMLHttpRequest();
	var url = "/postEvent";
	request.open("POST", url, true);
	
	request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	request.setRequestHeader("Content-length", eventObject.length);
	request.setRequestHeader("Connection", "close");

	request.send(eventObject);
}

//used to get lat and lon for current position
function getCurLatLon(position, address, formData) {
	var lon = position.coords.longitude;
	var lat = position.coords.latitude;
	var latLon = new CustomEvent("latLonFound", {'detail':{latitude:lat,longitude:lon,fData:formData}});
	document.body.dispatchEvent(latLon);
}

//used to get the lat and lon for an address
function getLatLon(address, formData) {
	var geocoder = new google.maps.Geocoder;
	geocoder.geocode( {'address': address}, function(results, status) {
		if (status == google.maps.GeocoderStatus.OK) {
			var lon = google.maps.LatLng.lng(results[0].geometry.location);
			var lat = google.maps.LatLng.lat(results[0].geometry.location);
			var latLon = new CustomEvent("latLonFound",{'detail': {latitude:lat,longitude:lon, fData:formData}});
			document.body.dispatchEvent(latLon);
		} else {
			alert("Geocode Error" + status);
		}
	});
}
