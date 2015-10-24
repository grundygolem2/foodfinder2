
class Event:
	def __init__(self,name,starttime,endtime,lat,lon,address,loc_help,desc,tags):
		self.name = name
		self.starttime = starttime.strftime('%Y-%m-%d %H:%M:%S')
		self.endtime = endtime.strftime('%Y-%m-%d %H:%M:%S')
		self.lat = float(lat)
		self.lon = float(lon)
		self.address = address
		self.loc_help = loc_help
		self.desc = desc
		self.tags = tags
		
	def __str__(self):
		return self.name
