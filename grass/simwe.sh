#Overland flow depth and discharge
g.region rural_1m res=2 -p

v.surf.rst -d input=elev_lid792_bepts elevation=elev_lid792_2m slope=dx_2m aspect=dy_2m tension=15 smooth=1.5 npmin=150 --overwrite
r.sim.water -t elevation=elev_lid792_2m dx=dx_2m dy=dy_2m rain_value=500 infil_value=0 man_value=0.05 depth=wdp_2m discharge=disch_2m nwalkers=10000 niterations=120 output_step=20 --overwrite
# d.rast wdp_2m.120
# d.rast disch_2m.120

# g.region -p raster=elevation
# r.sim.water -t elevation=elevation dx=dx_2m dy=dy_2m rain_value=50 infil_value=0 man_value=0.05 depth=wdp_2m discharge=disch_2m nwalkers=100000 niterations=120 output_step=20 --overwrite
python ./grass/grass-web-publishing/r.out.leaflet/r.out.leaflet.py raster=$DEMS output="./images"
