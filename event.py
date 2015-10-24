
class Event:
	def __init__(self,name,starttime,endtime,lat,lon,address,loc_help,desc,tags,dist):
		self.name = name
		self.starttime = starttime
		self.endtime = endtime
		self.lat = float(lat)
		self.lon = float(lon)
		self.address = address
		self.loc_help = loc_help
		self.desc = desc
		self.tags = tags
		self.dist = float(dist)
		
	def __str__(self):
		return self.name
