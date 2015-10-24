function onload() {
	navigator.geolocation.getCurrentPosition(getEventTable(position));



}

function getEventTable(position) {
	var eventsTable = document.getElementById("eventTable");
	var request = new XMLHttpRequest();
	var url = "/eventTable&lat=" + position.coords.latitude + "&lon=" + position.coords.longitude + "&maxdist=1";

	request.onreadystatechange = function () {
		if (request.readyState == 4) {
			eventsTable.innerHTML = request.responseText;
		}
	}

	request.open("GET", url, true);
	request.send();
}

