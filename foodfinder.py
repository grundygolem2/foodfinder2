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
	return render_template('index.html')

@app.route("/maptest")
def maptest():
	return render_template('map.html')

@app.route("/addEvent", methods=['POST']) #Change to POST later
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

	if rqst('info'):
		info = rqst('info')
	else:
		info = None

	if rqst('tags'):
		tags = rqst('tags')
	else:
		tags = None

	cur = mysql.connection.cursor()
	query = '''
	INSERT INTO foodfinder_events
	(`name`,`starttime`,`endtime`,`lat`,`lon`,`address`,`loc_help`,
	`info`,`tags`,`addedtime`)
	VALUES
	(%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
	'''

	query = ' '.join(query.split())
	cur.execute(query, (name,starttime,endtime,lat,lon,address,loc_help,info,tags))
	mysql.connection.commit()
	return "Inserted"

@app.route("/eventTable")
def getEventsRows():
	lat = float(request.args.get('lat'))
	lon = float(request.args.get('lon'))
	maxdist = float(request.args.get('maxdist'))
	events = getEventsWithinRadius(lat, lon, maxdist) # 42.4074840, -71.1190230

	return eventListToTableRows(events)


@app.route("/getEventsJSON", methods=['GET'])
def getEventsJSON():
	lat = float(request.args.get('lat'))
	lon = float(request.args.get('lon'))
	maxdist = float(request.args.get('maxdist'))
	events = getEventsWithinRadius(lat, lon, maxdist) # 42.4074840, -71.1190230 mine
	return eventListToJSON(events)

'''
Finds events within 'miles' from location ('lat','lon')
that are not yet over and have either begun or will begin
within the next hour
'''
def getEventsWithinRadius(lat, lon, miles):
	cur = conn.cursor()#mysql.connection.cursor()
	query = '''
		SELECT
		`name`, `starttime`, `endtime`, `lat`, `lon`,
		`address`, `loc_help`, `description`, `tags`,
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
	return [Event(*event_tuple[0:10]) for event_tuple in rv]

def eventListToJSON(event_list):
	event_dicts = [e.__dict__ for e in event_list]
	for i in range(0,len(event_dicts)):
		event_dicts[i]['starttime'] = str(event_dicts[i]['starttime'])
		event_dicts[i]['endtime'] = str(event_dicts[i]['endtime'])
	return json.dumps(event_dicts)

def eventListToTableRows(event_list):
	return render_template('event_table.html', events=event_list)

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
		tags = event_dict['tags']
		info = event_dict['info']
		event_list.append(Event(name,starttime,endtime,lat,lon,address,loc_help,info,tags,None))
	return event_list


if __name__ == "__main__":
    app.run()
