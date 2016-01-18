from flask import Flask, render_template, request
from flask.ext.mysqldb import MySQL
from event import Event
import time,datetime
import json
import os
import psycopg2
import urlparse


app = Flask(__name__)
app.debug = True

# MySQL configurations
app.config['MYSQL_USER'] = 'b6d4aa52f18aa3'
app.config['MYSQL_PASSWORD'] = '0580749d'
app.config['MYSQL_DB'] = 'heroku_3d39916556b689d'
app.config['MYSQL_HOST'] = 'us-cdbr-iron-east-03.cleardb.net'
mysql = MySQL(app)



"""
#postgres config
urlparse.uses_netloc.append("postgres")
url = urlparse.urlparse(os.environ["DATABASE_URL"])

conn = psycopg2.connect(
	database=url.path[1:],
	user=url.username,
	password=url.password,
	host=url.hostname,
	port=url.port
)
"""


@app.route("/")
def main():
	"""
	Renders the main index page when the root of the site is accessed,
	using the index.html template found in the templates folder

	@rtype:  string
	@return: Returns the rendered template as HTML
	"""
	return render_template('index.html')


@app.route("/addEvent", methods=['POST']) #Change to POST later
def addEvent():
	"""
	Called when a POST request is made
	to URL/addEvent.

	This function takes these fields from the POST request:

	Event name (name)
	Event start time (starttime)
	Event end time (endtime)
	Event latitude (lat)
	Event longitude (lng)
	Event address (address)
	Help with finding the event (loc_help)
	Event description (description)
	Event search tags (tags)

	...and stores them in the database as a row in the table of events.

	@rtype:  string
	@return: Returns the string "Inserted" upon success

	TODO: Validate user input
	"""

	if request.method == 'GET':
		rqst = request.args.get
	else:
		rqst = request.form.get

	name = rqst('name')
	starttime = rqst('starttime')
	endtime = rqst('endtime')
	lat = float(rqst('lat'))
	lng = float(rqst('lng'))

	if rqst('address'):
		address = rqst('address')
	else:
		address = None

	if rqst('loc_help'):
		loc_help = rqst('loc_help')
	else:
		loc_help = None

	if rqst('description'):
		description = rqst('description')
	else:
		description = None

	if rqst('tags'):
		tags = rqst('tags')
	else:
		tags = None

	if rqst('addedtime'):
		addedtime = rqst('addedtime')
	else:
		addedtime = None

	cur = mysql.connection.cursor()
	query = '''
	INSERT INTO foodfinder_events
	(`name`,`starttime`,`endtime`,`lat`,`lng`,`address`,`loc_help`,
	`description`,`tags`,`addedtime`)
	VALUES
	(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
	'''

	query = ' '.join(query.split())
	cur.execute(query, (name,starttime,endtime,lat,lng,address,loc_help,description,tags,addedtime))
	mysql.connection.commit()
	return "Inserted"

@app.route("/eventTable", methods=['POST'])
def getEventsRows():
	"""
	Called when POST request received at URL/eventTable

	@rtype:  string
	@return: Returns a rendered template containing HTML table rows
	of all events within a certain distance from a coordinate
	that are currently going on.

	Form fields:
	lat and lng are the latitude and longitude of the center of the search circle
	maxdist is the radius of the search, in miles.
	time is the time of interest, usually the current time (to find events going on now)
	"""

	lat = float(request.args.get('lat'))
	lng = float(request.args.get('lng'))
	maxdist = float(request.args.get('maxdist'))
	time = request.args.get('time')
	events = getEventsWithinRadius(lat, lng, maxdist, time) # 42.4074840, -71.1190230

	return eventListToTableRows(events)


@app.route("/getEventsJSON", methods=['GET'])
def getEventsJSON():
	"""
	Called when POST request received at URL/getEventsJSON

	@rtype:  string
	@return: Returns a JSON containing info on
	all events within a certain distance from a coordinate
	that are currently going on.

	Form fields:
	lat and lng are the latitude and longitude of the center of the search circle
	maxdist is the radius of the search, in miles.
	time is the time of interest, usually the current time (to find events going on now)
	"""
	lat = float(request.args.get('lat'))
	lng = float(request.args.get('lng'))
	maxdist = float(request.args.get('maxdist'))
	time = request.args.get('time')
	events = getEventsWithinRadius(lat, lng, maxdist, time) # 42.4074840, -71.1190230 mine
	return eventListToJSON(events)


def getEventsWithinRadius(lat, lng, miles, time):
	"""
	Finds events within a search radius
	that are not yet over and have either begun or will begin
	within the next hour

	@type  lat: number
	@param lat: Search area centerpoint latitude, in minutes
	@type  lng: number
	@param lng: Search area centerpoint longitude, in minutes
	@type  miles: number
	@param miles: Search area radius, in miles
	@type  time: string
	@param time: Current time. Format: 'YYYY-MM-DD HH:mm:ss'

	@rtype:  List of Event objects
	@return: Returns a list of Event objects (see event.py) which fit
			 the search criteria.
	"""

	cur = mysql.connection.cursor()
	query = '''
		SELECT
		`name`, `starttime`, `endtime`, `lat`, `lng`,
		`address`, `loc_help`, `description`, `tags`,
		(
			3959 * acos ( /* Constant for calculating miles. Use 6371 for km */
				cos ( radians(%f) ) /* My latitude */
				* cos( radians( `lat` ) )
				* cos( radians( `lng` ) - radians(%f) ) /* My longitude */
				+ sin ( radians(%f) ) /* My latitude */
				* sin( radians( `lat` ) )
			)
		) AS dist_miles
		FROM foodfinder_events
		HAVING dist_miles < %f
		AND '%s' <= `endtime` /* Get events that are not over */
		AND DATE_ADD('%s', INTERVAL 1 HOUR) >= `starttime` /* Get events begun up to starting within the hour */
		ORDER BY dist_miles
		LIMIT 0 , 20;''' % (lat, lng, lat, miles, time, time)
	query = ' '.join(query.split())
	rv = cur.execute(query)
	rv = cur.fetchall()
	# Pass fields to Event constructor and make list of all
	return [Event(*event_tuple[0:10]) for event_tuple in rv]

def eventListToJSON(event_list):
	"""
	Converts a list of Event objects (see event.py) to a JSON list.
	Used to output JSON when requested by client.

	@type event_list:  List of Event objects
	@param event_list: List of Event objects to convert to JSON format

	@rtype:  string
	@return: Returns the JSON list as a string
	"""
	event_dicts = [e.__dict__ for e in event_list]
	for i in range(0,len(event_dicts)):
		event_dicts[i]['starttime'] = str(event_dicts[i]['starttime'])
		event_dicts[i]['endtime'] = str(event_dicts[i]['endtime'])
	return json.dumps(event_dicts)

def eventListToTableRows(event_list):
	"""
	Converts a list of Event objects (see event.py) to a string containing HTML table rows.
	Used to output an HTML table when requested by client.

	Uses the template: templates/event_table.html

	@type event_list:  List of Event objects
	@param event_list: List of Event objects to convert to JSON format

	@rtype:  string
	@return: Returns the HTML table rows as a string, using a template
	"""
	return render_template('event_table.html', events=event_list)

def jsonToEventList(eventsJson):
	"""
	Converts a JSON list of events to a Python list of Event objects

	@rtype:  List of Event objects
	@return: A Python list of Event objects derived from the JSON list input.
	"""
	list_of_dicts = json.loads(eventsJson)
	if not isinstance(list_of_dicts,list):
		list_of_dicts = [list_of_dicts]
	event_list = []
	for event_dict in list_of_dicts:
		name = event_dict['name']
		starttime = datetime.datetime.strptime(event_dict['starttime'], '%Y-%m-%d %H:%M:%S')
		endtime = datetime.datetime.strptime(event_dict['endtime'], '%Y-%m-%d %H:%M:%S')
		lat = float(event_dict['lat'])
		lng = float(event_dict['lng'])
		address = event_dict['address']
		loc_help = event_dict['loc_help']
		tags = event_dict['tags']
		description = event_dict['description']
		event_list.append(Event(name,starttime,endtime,lat,lng,address,loc_help,description,tags,None))
	return event_list


if __name__ == "__main__":
	"""
	When this file is executed, begin the server
	"""
	app.run()
