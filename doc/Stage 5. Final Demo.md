
# Final Demo

1. **Clear demo presentation. Arriving on time and completing the presentation within the given time frame (details will come at a later time on campuswire). (+1%)**
2. **A clear demo featuring a user's end-to-end process interacting with the system that involves presenting the CRUD operations, the advanced database program, and the (optional) creative function (10%)**
3. **The advanced database program contains at least a sophisticated transaction+trigger or a stored procedure+trigger (+12%)**
    * Project TAs may deduct up to 50% of this component if the transaction and/or trigger does not make sense to the application.

    * __If you implemented stored procedure+trigger (12%):__
        * Stored procedure requirements (8%): A complete and functioning stored procedure (2%), involves at least two advanced queries (2%, 1% each), uses cursors, involves looping and control (e.g., IF statements) structures (2%), provides useful functionality to the application (2%). 
        * Trigger requirements (4%): A complete and functioning trigger (1.5%), involves event, condition (IF statement), and action (Update, Insert or Delete) (1.5%), provides useful functionality to the application (1%).

## Stored Procedure
<pre>
DROP PROCEDURE IF EXISTS CrimesByDate;
DELIMITER $$

CREATE PROCEDURE CrimesByDate(IN month VARCHAR(2), IN year VARCHAR(4))
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE varAreaName VARCHAR(20);
    DECLARE varTotalCrimes INT;
    DECLARE varCrimeRate VARCHAR(20);
    DECLARE cur CURSOR FOR 
        (SELECT AreaName, COUNT(ReportDistrictCode) AS total
FROM Incident i NATURAL JOIN Location l NATURAL JOIN District d
        WHERE Date LIKE CONCAT('%', month, '%/',year, '%')
        GROUP BY AreaName);
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;

    DROP TABLE IF EXISTS NewTable;
    CREATE TABLE IF NOT EXISTS NewTable (
        AreaName VARCHAR(20) PRIMARY KEY, 
        CrimeRate VARCHAR(20), 
        NumCrimes INT
    );

    OPEN cur;
    REPEAT
        FETCH cur INTO varAreaName, varTotalCrimes;
 
        IF varTotalCrimes > 999 THEN
            SET varCrimeRate = 'High';
        ELSEIF varTotalCrimes > 750 THEN
            SET varCrimeRate = 'Medium';
        ELSE
            SET varCrimeRate = 'Low';
        END IF;

        INSERT IGNORE INTO NewTable (AreaName, CrimeRate, NumCrimes)
        VALUES (varAreaName, varCrimeRate, varTotalCrimes);
    until done
    END REPEAT;

    CLOSE cur;

    SELECT AreaName, CrimeRate, NumCrimes FROM NewTable;
END $$

DELIMITER ;
</pre>

## Trigger
<pre>
DELIMITER //
CREATE TRIGGER AddedIncident
BEFORE INSERT ON Incident FOR EACH ROW
BEGIN
    DECLARE location_count INT;
    SELECT COUNT(*) INTO location_count FROM Location WHERE Address = NEW.Address;
    IF location_count = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'The Location does not exist.';
    END IF;
END;
//
DELIMITER ;

</pre>




## Discussion Points
1. **Explain your choice for the advanced database program and how it is suitable for your application. For example, if you chose a stored procedure+trigger, explain how this choice is suitable for your application.**
    * This stored procedure uses a cursor to fetch the total number of crime incidents for each area in the given month and year. It then assigns a crime rate based on the total number of crimes using IF statements. The results are inserted into a new table called "NewTable" using INSERT IGNORE INTO to avoid duplicates. Finally, the stored procedure returns the AreaName, CrimeRate, and NumCrimes from "NewTable".
    * This trigger will be triggered before a new row is inserted into the Incident table (BEFORE INSERT ON Incident). For each new row that is inserted, the trigger will first count the number of occurrences of the Address value in the Location table. If the count is 0, which means the Address does not exist in the Location table, the trigger will raise an error with a custom message and rollback the changes made to the Incident table. The error will have a SQLSTATE value of '45000', which indicates a user-defined error. If the Address value does exist in the Location table, the trigger will allow the insertion to proceed without any further action.
3. **How did the creative element add extra value to your application?**
    * We chose to implement a map as a creative element for our app... Since the database is about crime in LA, simply displaying the region/district/area name does not really show the user where the crime is happening. 
    * Our map interface allows the user to actually see and compare the crime of multiple different areas just by looking at the generated map.
3. **How would you want to further improve your application? In terms of database design and system optimization?**
    * We would like to make the user interface more intuitive by adding more UI elements like drop-down menus (select month), scroll bars (select year range), or checkboxes (select common victim traits) as filter settings.
    * We would like to make the map dynamically update with additional records, which with our current implementation takes too long to re-render.
    * Time permitted, we would like to add other tables with new information like weather in LA or even data from other cities
    * Allow users to report incidents from the app (have to be authorized before adding to database)
    * User accounts (would enable the above feature)
4. **What were the challenges you faced when implementing and designing the application?** 
    * taking the large table from Kaggle and splitting it into smaller tables
    * Implementing the stored procedure; there were a lot of weird bugs initially that we had to troubleshoot 
    * adding the map element, connecting the display with the basic website we had created in the previous part. 
    * making the map dynamically update
5. **How was it the same/different from the original design?**
    * Difference: planned on using Python so we could use Geopandas for the map element, but ended up going with JS/React and using the Google Map JS API
    * Difference: we originally planned for the map to have more functionality, but had to scale back due to technical issues
    * Similarity: can search for crimes and filter based on various different criteria, such as location, year, crime type, etc
6. **If you were to include a NoSQL database, how would you incorporate it into your application?**
    * If we needed to scale our project to multiple cities or include vast amounts of new data we could migrate our existing database to a NoSQL solution to speed up queries and distribute the data across multiple devices
    * If we wanted to keep our existing SQL database, we could use a NoSQL database to store user account information separately from the LA Crime data
