# CO_Cron

Scheduler for Colorado Demography tasks.  Despite the name, uses node-schedule rather than cron.  Deployed as Docker Container.

#### Run on Cron - Firewalled (files not in this repo)

-------

**get\_competitive.php**  ->  https://dola.colorado.gov/gis-tmp/competitive.json : Competitive Grants<br />
**get\_formulaic.php**  ->  https://dola.colorado.gov/gis-tmp/formulaic.json : Formula-based Grants<br />
**lg2cnty.php**  ->  https://dola.colorado.gov/gis-tmp/lg2cnty.json : LGID to County crosswalk<br />
**lgbasic.php**  ->  https://dola.colorado.gov/gis-tmp/lgbasic.json : Local Government Basic Information Table<br />
**limlevy.php**  ->  https://dola.colorado.gov/gis-tmp/limlevy.json : Mill Levy Information by LGID<br />
<br />
### Files in this Repo

--------

**load\_lg2cnty.php** : Load the lg2cnty file from above onto the DOLA GIS Server in a PostGIS database table<br />
**load\_lgbasic.php** : Load the lgbasic file from above onto the DOLA GIS Server in a PostGIS database table<br />
**load\_limlevy.php** : Load the limlevy file from above onto the DOLA GIS Server in a PostGIS database table<br />
<br />
**counties.php (static)** : County information with bounding box and coordinate info.  Access through php require, and use $c\_counties<br />
**lgid\_place\_crosswalk.php (static)**: Crosswalk between LGID, FIPS, and Name for incorporated munis in Colorado<br />
<br />
#### (workhorse files)
**fs\_shapes.php** : use PostGIS to get bounding box and coordinate info for governments.  Combine with LGBasic Information.  Add counties.php data (manually created bbox and coord data for counties)<br />

#### (output files)
**geopts.json** : Output file from fs\_shapes.php.  All local governments in Colorado:  Bounding Box and Coordinate Information, along with LGBasic Data.  Used to power search in several applications.<br />

#### .gitignore(d)

--------

**dolagis\_master.php** - Connection to DOLA GIS Server<br />
**dolagis\_view.php** - View Only connection to DOLA GIS Server<br />
