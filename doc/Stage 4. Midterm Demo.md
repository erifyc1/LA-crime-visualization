---
title: Midterm Demo
---
## Data Definition Language (DDL)
<pre>
CREATE TABLE Crime (
    Code INT PRIMARY KEY, 
    Description VARCHAR(50)
);
CREATE TABLE Area(
    Name VARCHAR(20) PRIMARY KEY,
    AreaID INT
);
CREATE TABLE Location (
    Address VARCHAR(100) PRIMARY KEY, 
    Latitude REAL,
    Longitude REAL,
    ReportDistrictCode INT
);

CREATE TABLE Incident (
    DRNumber INT PRIMARY KEY, 
    Time VARCHAR(20), 
    Date VARCHAR(40),
    Code INT,
    Address VARCHAR(100)
);

CREATE TABLE District(
    ReportDistrictCode INT PRIMARY KEY,
    AreaName VARCHAR(20)
);

CREATE TABLE Victim (
    DRNumber INT,
    Age INT, 
    Sex VARCHAR(2), 
    Descent VARCHAR(20),
    FOREIGN KEY (DRNumber) REFERENCES Incident(DRNumber) ON DELETE CASCADE
);
</pre>
### Insert New Records
<pre>

const dRNumber = req.body.dRNumber;
const time = req.body.time;
const date = req.body.date;
const code = req.body.code;
const address = req.body.address; 


const sql = `INSERT INTO Incident (DRNumber, Time, Date, Code, Address) VALUES ('${dRNumber}','${time}','${date}','${code}','${address}')`;
</pre>
### Search the database using a keyword search.
<pre>
const date = req.body.date;

const sql = 'SELECT AreaName, COUNT(ReportDistrictCode) AS NumCrimes
FROM Incident i NATURAL JOIN Location l NATURAL JOIN District d
WHERE Date == '${date}'
GROUP BY AreaName
ORDER BY NumCrimes DESC';
</pre>

### Update records on the database 
<pre>
const anameold = req.body.anameold;
const anamenew = req.body.anamenew;

const sql = 'UPDATE District
SET AreaName = '${anamenew}'
WHERE AreaName = '${anameold'}'';
</pre>

### Delete rows from the database

<pre>
const code = req.body.code;


const sql = 'DELETE FROM Incident WHERE Code = '${code}'';
</pre>
### Integrate into your application both of the advanced SQL queries you developed in stage 
## Advanced Query 1:
##### Count the number of incidents of crime in each area ordered by most to least
<pre>
SELECT DISTINCT a.Name as AreaName, t.NumIncidents
FROM Incident i JOIN Location l ON (i.Address = l.Address) 
                JOIN District d ON (l.ReportDistrictCode = d.ReportDistrictCode) 
                JOIN Area a ON (d.AreaName = a.Name)
                JOIN (
                    SELECT a1.Name, Count(DRNumber) as NumIncidents
                    FROM Incident i1 JOIN Location l1 ON (i1.Address = l1.Address)
                                     JOIN District d1 ON (l1.ReportDistrictCode = d1.ReportDistrictCode) 
                                     JOIN Area a1 ON (d1.AreaName = a1.Name) 
                    GROUP BY a1.Name
                    ) t ON (t.Name = a.Name)
ORDER BY t.NumIncidents DESC
LIMIT 15;
</pre>
In the final version of the web application, we would be able to display each area on a map and possibly color code it by the number of incidents. 
## Advanced query 2: 
##### Number of crimes in an area on a given year, e.g. 2021, from most to least
<pre>
SELECT AreaName, COUNT(ReportDistrictCode) AS NumCrimes
FROM Incident i NATURAL JOIN Location l NATURAL JOIN District d
WHERE Date LIKE "%2021%"
GROUP BY AreaName
ORDER BY NumCrimes DESC
LIMIT 15;
</pre>
In the final version of the web application, we would be able to select any given year a user wants to see, not just 2021. 


## Presentation Stuff
### 1. Intro
* LA Crime Visualization 
* Use: tracking historical crime patterns in LA
    * by location/district/area
    * by time of year or day
    * by crime type
    * by victim race/gender
* Interactive component: map
* Tables:
    * Crime
    * Incident
    * Victim
    * Location
    * Area
    * District


### 2. Show Interface
* Create, Read, Update, Delete
* make sure to show changes in DB
* Url: [35.209.15.193](http://35.209.15.193/)

### 3. Advanced Queries
* what each query does
* significance
* appearance on final product

### 4. Next Steps
* Map visualization 
* https://developers.google.com/maps/
* Main screen will be the map, with a text based portion beneath it  that actually displays the records. 
* There will be a sidebar that allows for CRUD actions and item search/filter