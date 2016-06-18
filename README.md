# CO_Cron

Scheduler for Colorado Demography tasks.  Despite the name, uses node-schedule rather than cron.  Deployed as Docker Container.

Schedules a suite of imports, uploads, and exports to maintan data currency on many of Demography's (and some of DOLA's) Applications.

Tasks include:

Special District dataset exports
 - Queries DOLAs Special Districts database and extracts shapefile data for common categories of Special Districts.
 
Bureau of Labor Statistics data update
 - Calls the BLS API to extract current Employment data for Colorado Cities and Counties
 
DOLA Grant Data Pipeline
 - Queries static assets exported by DOLAs main Oracle database, links tabular data to geographic identifiers, and produces an output dataset suitable for ingestion by the [Colorado Financial Services Grants Map](https://demography.dola.colorado.gov/CO_Grants/).
 
Uploads DOLA data into Demography Database
 - Keeps copies of standard DOLA lookup tables in Demography's PostgreSQL database for easier access.
 
Runs Database backup tasks
 - Saves a weekly copy of the DOLA database.
 
 
 ## Details
 
 //copy to Server and Website Documentation