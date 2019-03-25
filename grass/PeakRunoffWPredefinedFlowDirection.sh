#Peak runoff with predefined flow direction
#Compute peak runoff with predefined flow direction along the stream inluding culvert under the road.

#compute direction (aspect) of the given streams:
v.to.rast streams output=streams_dir_2m use=dir

#Compute stream dx and dy using direction and slope equal to 2 degrees:
r.mapcalc "dxstr_2m = tan(2.)*cos(streams_dir_2m)"
r.mapcalc "dystr_2m = tan(2.)*sin(streams_dir_2m)"

#Compute combined DEM and stream dx and dy:
r.mapcalc "dxdemstr_2m = if(isnull(dxstr_2m), dx_2m, dxstr_2m)"
r.mapcalc "dydemstr_2m = if(isnull(dystr_2m), dy_2m, dystr_2m)"

#run model
r.sim.water -t elevation=elev_lid792_2m dx=dxdemstr_2m dy=dydemstr_2m rain_value=50 infil_value=0 man_value=0.05 depth=wdpstr_2m discharge=dischstr_2m nwalkers=100000 niterations=120 output_step=20
# d.rast dischstr_2m.120