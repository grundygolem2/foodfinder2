from flask import Flask, render_template, request
from flask.ext.mysqldb import MySQL
from event import Event
import time,datetime
import json

app = Flask(__name__)
app.debug = True
 
# MySQL configurations
app.config['MYSQL_USER'] = 'foodfinderuser'
app.config['MYSQL_PASSWORD'] = 'tuftsffuser'
app.config['MYSQL_DB'] = 'foodfinder'
app.config['MYSQL_HOST'] = '10.245.150.176'
mysql = MySQL(app)

@app.route("/")
def main():
	return render_template('signup.html')
	
@app.route("/addEvent", methods=['GET']) #Change to POST later
def addEvent():
	if request.method == 'GET':
		rqst = request.args.get
	else:
		rqst = request.form.get
	
	name = rqst('name')
	starttime = rqst('starttime')
	endtime = rqst('endtime')
	lat = float(rqst('lat'))
	lon = float(rqst('lon'))
	
	if rqst('address'):
		address = rqst('address')
	else:
		address = None
	
	if rqst('loc_help'):
		loc_help = rqst('loc_help')
	else:
		loc_help = None
	
	if rqst('desc'):
		desc = rqst('desc')
	else:
		desc = None
		
	if rqst('tags'):
		tags = rqst('tags')
	else:
		tags = None
	
	cur = mysql.connection.cursor()
	query = '''
	INSERT INTO foodfinder_events
	(`name`,`starttime`,`endtime`,`lat`,`lon`,`address`,`loc_help`,
	`desc`,`tags`,`addedtime`)
	VALUES
	(%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
	'''
	
	query = ' '.join(query.split())
	cur.execute(query, (name,starttime,endtime,lat,lon,address,loc_help,desc,tags))
	mysql.connection.commit()
	return query

	
@app.route("/getEvents", methods=['GET'])
def getEvents():
	lat = float(request.args.get('lat'))
	lon = float(request.args.get('lon'))
	maxdist = float(request.args.get('maxdist'))
	events = getEventsWithinRadius(lat, lon, maxdist) # 42.4074840, -71.1190230
	return eventListToJSON(events)
	
'''
Finds events within 'miles' from location ('lat','lon')
that are not yet over and have either begun or will begin
within the next hour
'''
def getEventsWithinRadius(lat, lon, miles):
	cur = mysql.connection.cursor()
	query = '''
		SELECT
		`name`, `starttime`, `endtime`, `lat`, `lon`,
		`address`, `loc_help`, `desc`, `tags`,
		(
			3959 * acos ( /* Constant for calculating miles. Use 6371 for km */
				cos ( radians(%f) ) /* My latitude */
				* cos( radians( `lat` ) )
				* cos( radians( `lon` ) - radians(%f) ) /* My longitude */
				+ sin ( radians(%f) ) /* My latitude */
				* sin( radians( `lat` ) )
			)
		) AS dist_miles
		FROM foodfinder_events
		HAVING dist_miles < %f
		AND NOW() <= `endtime` /* Get events that are not over */
		AND DATE_ADD(NOW(), INTERVAL 1 HOUR) >= `starttime` /* Get events begun up to starting within the hour */
		ORDER BY dist_miles
		LIMIT 0 , 20;''' % (lat, lon, lat, miles)
	query = ' '.join(query.split())
	rv = cur.execute(query)
	rv = cur.fetchall()
	
	# Pass fields to Event constructor and make list of all
	return [Event(*event_tuple[0:9]) for event_tuple in rv] 

def eventListToJSON(event_list):
	return json.dumps([e.__dict__ for e in event_list])

def jsonToEventList(eventsJson):
	list_of_dicts = json.loads(eventsJson)
	if not isinstance(list_of_dicts,list):
		list_of_dicts = [list_of_dicts]
	event_list = []
	for event_dict in list_of_dicts:
		name = event_dict['name']
		starttime = datetime.datetime.strptime(event_dict['starttime'], '%Y-%m-%d %H:%M:%S')
		endtime = datetime.datetime.strptime(event_dict['endtime'], '%Y-%m-%d %H:%M:%S')
		lat = float(event_dict['lat'])
		lon = float(event_dict['lon'])
		address = event_dict['address']
		loc_help = event_dict['loc_help']
		desc = event_dict['desc']
		tags = event_dict['tags']
		event_list.append(Event(name,starttime,endtime,lat,lon,address,loc_help,desc,tags))
	return event_list
	

if __name__ == "__main__":
    app.run()
