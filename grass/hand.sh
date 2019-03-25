g.region -p raster=inundation_5.0
r.watershed elevation=elevation accumulation=flowacc drainage=drainage stream=streams threshold=100000
r.to.vect input=streams output=streams type=line
r.stream.distance stream_rast=streams direction=drainage elevation=elevation method=downstream difference=above_stream
r.lake.series elevation=above_stream start_water_level=0 end_water_level=2 water_level_step=0.1 output=inun seed_raster=streams --overwrite


python ./r.out.leaflet/r.out.leaflet.py raster="inun_0.0,inun_0.1,inun_0.2" output="../images"


