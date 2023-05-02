# Stage 3 Database Design
### Jacob Stolker, Alex Capps, Alex Ostrowski, Tianshun Gao

# GCP Terminal
![gcpimg](https://i.imgur.com/4WjCKPM.png)
# Data Definition Language (DDL)
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




# Advanced Query 1:
#### Count the number of incidents of crime in each area ordered by most to least
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
ORDER BY t.NumIncidents DESC;
</pre>
![img1](https://i.imgur.com/ZlUgU4j.png)


# Advanced query 2: 
#### Number of crimes in an area on a given year, e.g. 2021, from most to least
<pre>
SELECT AreaName, COUNT(ReportDistrictCode) AS NumCrimes
FROM Incident i NATURAL JOIN Location l NATURAL JOIN District d
WHERE Date LIKE "%2021%"
GROUP BY AreaName
ORDER BY NumCrimes DESC;
</pre>
![img2](https://i.imgur.com/O2eMRFn.png)


<!-- # Advanced query 3: 
#### Number of incidents per each crime code (type of crime).
<pre>
SELECT Code, Description, Count(DRNumber)
FROM Incident NATURAL JOIN Crime
GROUP BY Code; 
</pre>
![img3](https://i.imgur.com/VVNugwo.png) -->

# Indexing
## Pre-indexing
* Query 1: 3.34s
![q1_default](https://i.imgur.com/PmrXBfp.png)
* Query 2: 0.65s
![q2_default](https://i.imgur.com/NxLHaXb.png)
<!-- * Query 3: 0.52s -->
## Indexing
### Query 1
##### Method A: 
<pre>
CREATE INDEX idx_iAddress ON Incident(Address);
CREATE INDEX idx_lAddress ON Location(Address);
CREATE INDEX idx_lRptDistCd ON Location(ReportDistrictCode);
CREATE INDEX idx_dRptDistCd ON District(ReportDistrictCode);
CREATE INDEX idx_dArea ON District(AreaName);
CREATE INDEX idx_aArea ON Area(Name);
</pre>

##### Method B:
<pre>
CREATE INDEX idx_dArea ON District(AreaName);
CREATE INDEX idx_aArea ON Area(Name);
</pre>

##### Method C:
<pre>
CREATE INDEX idx_iAddress ON Incident(Address);
CREATE INDEX idx_lAddress ON Location(Address);
</pre>

### Query 2
##### Method A:
<pre>
CREATE INDEX idx_a1 ON Incident (Address);
CREATE INDEX idx_a2 ON Location (Address);
CREATE INDEX idx_rd1 ON Location (ReportDistrictCode);
CREATE INDEX idx_rd2 ON District (ReportDistrictCode);
</pre>

##### Method B:
<pre>
CREATE INDEX idx_add1 ON Incident (Address);
CREATE INDEX idx_add2 ON Location (Address);
</pre>

##### Method C:
<pre>
CREATE INDEX idx_rdc1 ON Location (ReportDistrictCode);
CREATE INDEX idx_rdc2 ON District (ReportDistrictCode);
</pre>
<!-- ### Query 3
##### Method A:
<pre>
CREATE INDEX idx_crime ON Incident (Code);
CREATE INDEX idx_desc ON Crime (Description);
CREATE INDEX idx_da ON Incident (DRNumber);
</pre>
##### Method B:
<pre>
CREATE INDEX idx_desc ON Crime (Description);
</pre>
##### Method C:
<pre>
</pre> -->
## Post-indexing
### Query 1
##### Method A
* 1.81s (major improvement)
* Using EXPLAIN ANALYZE we can see that the greatest costs come from the table joins, so we decided to create indices on these attributes that are joined together. Also, there is a lot of reptition of address in Incident table, so creating an index on it should speed up joining process.
* This indexing strategy greatly improved the speed of the query.
![q1_a](https://i.imgur.com/MDJ6Gxj.png)
##### Method B
* 3.43s (no improvement)
* Since query 1 uses a join comparing AreaName in both tables Area and District, we decided to create indices on both of these attributes so that it is easier to compare them. They are not numerical values, so we thought this would be helpful. 
* However, since the cost of joins on AreaName was low initially, this indexing strategy did not really improve the speed of the query.
![q1_b](https://i.imgur.com/gtLbo0G.png)
##### Method C
* 1.92s (major improvement)
* Using EXPLAIN ANALYZE we can see that one of the greatest costs comes from the table joins on Address, so we decided to create indices on Address to speed up joining process. 
* This indexing strategy greatly improved the speed of the query.
![q1_c](https://i.imgur.com/NZHD64S.png)
### Query 2
##### Method A
* 0.65s (no improvement)
* For query 2, we created indices for all attributes joined in the query, since the joins seemed to be costing the most.
* This did not make a difference. We believe that since all attributes analyzed during the query are keys for their repsective tables, they're already indexed to improve execution time. 
![q1_a](https://i.imgur.com/LVWyVud.png)
##### Method B
* 0.65s (no improvement)
* For query 2, we try to create indices only on the attribute Address in Location and Incident table because Incident table has a huge number of records. Location and District table have only a few records, which creating indices on them we think doesn't make difference.
* This did not make improve the query. We believe this is for the same reason as method A. 
![q1_b](https://i.imgur.com/mcZpnsL.png)
##### Method C
* 0.65 (no improvement)
* Like mentioned in Method B, Location and District table have only a few records, so we want to see if only creating indices on the joined attribute will affect the performance.
* This did not make improve the query. We believe this is for the same reason as method A. 
![q1_c](https://i.imgur.com/UKDz9mZ.png)

<!-- * Query 3: 0.25s 
    * 0.27s (52%) major improvement
    * Since query 3 uses a natural join to join by crime code, we decide to create an index on crime code. We also added indices on commonly accessed attributes like Incident.DRNumber and Crime.Description.
    * This indexing strategy greatly improved the speed of the query.
 -->
