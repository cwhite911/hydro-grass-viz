#!/usr/bin/env python

#Overland flow depth and discharge
# g.region rural_1m res=2 -p

# v.surf.rst -d input=elev_lid792_bepts elevation=elev_lid792_2m slope=dx_2m aspect=dy_2m tension=15 smooth=1.5 npmin=150 --overwrite
# r.sim.water -t elevation=elev_lid792_2m dx=dx_2m dy=dy_2m rain_value=500 infil_value=0 man_value=0.05 depth=wdp_2m discharge=disch_2m nwalkers=10000 niterations=120 output_step=20 --overwrite


# g.region -p raster=elevation
# r.sim.water -t elevation=elevation dx=dx_2m dy=dy_2m rain_value=50 infil_value=0 man_value=0.05 depth=wdp_2m discharge=disch_2m nwalkers=100000 niterations=120 output_step=20 --overwrite
# python ./grass/grass-web-publishing/r.out.leaflet/r.out.leaflet.py raster="inun_0.0,inun_0.5,inun_1.0,inun_1.5,inun_2.0,inun_2.5,inun_3.0,inun_3.5,,inun_4.0" output="./images"

import os
import grass.script as gscript

ROOT="~/Downloads/WakeCoNC_elevation_20944"
def main():
    
    for (dirpath, dirs, files) in os.walk("/Users/smortop/Downloads/WakeCoNC_elevation_20944"): 
        print('Found directory: %s' % dirpath)
        for file in files:
            if not file.endswith(".xml") and not file.endswith(".txt"):
                outfile = file.split("\\")[-1].replace(".img", "")
                print("Reading external file %s" % outfile)
                inputFile = "/Users/smortop/Downloads/WakeCoNC_elevation_20944/" + file
                gscript.read_command('r.import', input=inputFile, output=outfile)
                # gscript.write_command('r.external.out', directory="/Users/smortop/Documents/GitHub/hydro-grass-viz/images/grassoutput", format="GTiff")
                print("Setting Computational Region")
                gscript.run_command('g.region', raster=outfile)
                dxOut="%s_dx" % outfile
                dyOut="%s_dy" % outfile
                print("Calculating dx dy")
                gscript.run_command('r.slope.aspect', elevation=outfile, dx=dxOut, dy=dyOut)
                depth="%s_wdp" % outfile
                discharge="%s_disch" % outfile
                print("Running r.sim.water")
                gscript.run_command('r.sim.water', dx=dxOut, dy=dyOut, elevation=outfile, rain_value=50, infil_value=0, man_value=0.05, depth=depth, discharge=discharge, nwalkers=500000, niterations=120, output_step=20)
                outfileslist=[discharge + ".020", discharge + ".040", discharge + ".060", discharge + ".080", discharge + ".100", discharge + ".120"]
                outfiles= ','.join(outfileslist)
                print("Exporting leaflet results")
                # os.system("python /Users/smortop/Documents/GitHub/hydro-grass-viz/grass/r.out.leaflet/r.out.leaflet.py raster='{0}' output='/Users/smortop/Documents/GitHub/hydro-grass-viz/images/simwe'".format(outfiles))


if __name__ == '__main__':
    main()

# 'D03_37_20171201_20160228_disch.120,D03_37_20079201_20160228_disch.120,D03_37_20170101_20160228_disch.120,D03_37_20171301_20160228_disch.120,D03_37_20079301_20160228_disch.120,D03_37_20172203_20160228_disch.120,D03_37_20079101_20160228_disch.120,D03_37_20171101_20160228_disch.120,D03_37_20170301_20160228_disch.120,D03_37_20172403_20160228_disch.120,D03_37_20170201_20160228_disch.120'
# python r.out.leaflet.py raster='D03_37_20171201_20160228_disch.120' output='/Users/smortop/Documents/GitHub/hydro-grass-viz/images/simwe'