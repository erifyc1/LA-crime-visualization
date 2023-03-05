---
title: Database Design
---
# Stage 3
### Jacob Stolker, Alex Capps, Alex Ostrowski, Tianshun Gao

## GCP Terminal
![gcpimg](https://i.imgur.com/4WjCKPM.png)
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
![img1](https://i.imgur.com/ZlUgU4j.png)


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
![img2](https://i.imgur.com/O2eMRFn.png)


## Advanced query 3: 
##### Number of incidents per each crime code (type of crime).
<pre>
SELECT Code, Description, Count(DRNumber)
FROM Incident NATURAL JOIN Crime
GROUP BY Code
LIMIT 15; 
</pre>
![img3](https://i.imgur.com/VVNugwo.png)

## Indexing
### Pre-indexing
* Query 1: 3.17s
* Query 2: 0.64s
* Query 3: 0.52s

### Indexing
##### Query 1
<pre>
CREATE INDEX idx_iAddress ON Incident(Address);
CREATE INDEX idx_lAddress ON Location(Address);
CREATE INDEX idx_lRptDistCd ON Location(ReportDistrictCode);
CREATE INDEX idx_dRptDistCd ON District(ReportDistrictCode);
CREATE INDEX idx_dArea ON District(AreaName);
CREATE INDEX idx_aArea ON Area(Name);
</pre>


##### Query 2
<pre>
CREATE INDEX idx_a1 ON Incident (Address);
CREATE INDEX idx_a2 ON Location (Address);
CREATE INDEX idx_rd1 ON Location (ReportDistrictCode);
CREATE INDEX idx_rd2 ON District (ReportDistrictCode);
</pre>


##### Query 3
<pre>
CREATE INDEX idx_crime ON Incident (Code);
CREATE INDEX idx_desc ON Crime (Description);
CREATE INDEX idx_da ON Incident (DRNumber);
</pre>

### Post-indexing
* Query 1: 1.81s 
    * 1.36s (43%) major improvement
    * Since query 1 uses multiple joins, we decide to create indices on these attributes that are joined together. Also, there is a lot of reptition of address in Incident table, so creating an index on it should speed up joining process.
    * This indexing strategy greatly improved the speed of the query.
* Query 2: 0.62s
    * 0.02s (3%) negligible improvement
    * For query 2, we created indices for attributes joined in the query.
    * We believe that since all attributes analyzed during the query are keys for their repsective tables, they're already indexed to improve execution time. We're also indexing on strings, which might not be indexed as well as numbers. 
* Query 3: 0.25s 
    * 0.27s (52%) major improvement
    * Since query 3 uses a natural join to join by crime code, we decide to create an index on crime code. We also added indices on commonly accessed attributes like Incident.DRNumber and Crime.Description.
    * This indexing strategy greatly improved the speed of the query.




