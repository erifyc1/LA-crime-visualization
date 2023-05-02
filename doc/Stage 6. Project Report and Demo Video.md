---
title: Stage 6. Project Report and Demo Video
---
# Stage 6 Project Report and Video

[Final Demo Video](https://youtu.be/sGEus_fs5qk)

1. **Please list out changes in the directions of your project if the final project is different from your original proposal (based on your stage 1 proposal submission).**
    * We pretty much stuck to our original proposal except for some implementation details. We used the data set from Kaggle on crimes in Los Angeles. We then splitted it into six tables, which are Crime, Area, Location, Incident, District and Victim, to store relevant information. We implemented a google map showing all crime incidents as our creative component like we proposed, but we underestimated technical difficulties for some features that we proposed in the first stage, like filtering crimes on the map in terms of attributes.

2. **Discuss what you think your application achieved or failed to achieve regarding its usefulness.**
    * We succeeded in creating a basic application for users to learn the specifics about crime in LA by searching by different criteria.
    * We succeeded in using Google Cloud Platform (GCP) to deploy our database and keep it running and accessible.
    * We succeeded in using GCP's Compute to develop and deploy our front-end.
    * We wanted to implement an interactive map that could show users' queries marked on it. However, due to technical issues, we had to scale back the map to simply show an overview of crimes across LA, rather than being truly interactive.
    * Despite this failure, we actually implemented some additional features to the map that we did not originally plan. Specifically, pins on the map are clustered together as one marker and colored based on the number of pins represented by the marker. Additionally, zooming in on the markers and clicking on them reveals information about the department of records number, address, and some general information on the victim.


3. **Discuss if you changed the schema or source of the data for your application**
    * Other than the assumptions we made about our database in Stage 2, we did not change the schema or source of the data for our application. 
    * The only possible exception to this is our trigger we created to ensure a given Incident address exists in the Location table before it can be added.

4. **Discuss what you change to your ER diagram and/or your table implementations. What are some differences between the original design and the final design? Why? What do you think is a more suitable design?**
    * We didn't really change anything organization/implementation wise. We did change some of our naming conventions for the purpose of clarity. E.g. changing stationID to areaID, and DistrictName to AreaName, since that made more sense as we came to understand the data better. Our original ER diagram solidly supported what we were hoping to achieve. 



5. **Discuss what functionalities you added or removed. Why?**
    * We added a lot of various functionality just with our map feature, such as:
        * the ability to click individual pins on the map and see information about the crime committed there. 
        * When zooming out, the pins aggregate together to show crime density in certain locations.
        * There is a 3D map view to allow users to better understand the location a crime was committed at 
    * We removed some search functionalities that seemed less vital than the main ones due to time constraints. This included:
        * Searching by victim data or viewing statistics on victim data
        * Searching by specific hour of the day 
    * Specific combinations of search criteria


6. **Explain how you think your advanced database programs complement your application.**
    * The stored procedure uses a cursor to fetch the total number of crime incidents for each area in the given month and year. It then assigns a crime rate based on the total number of crimes. stored procedure returns the Area Name, Crime Rate, and number of crimes. This allows users to see with a quick glance which areas have high/low crime compared to others instead of spending time comparing each numerical value. It's useful as a stored procedure because users can easily select and compare crime rates in multiple districts across multiple months. 
    * The trigger will be triggered before a new row is inserted into the Incident table (BEFORE INSERT ON Incident). If Address does not exist in the Location table, the trigger will raise an error with a custom message and rollback the changes made to the Incident table. If the Address value does exist in the Location table, the trigger will allow the insertion to proceed without any further action. This prevents a user from inserting crimes at an address that we don't have stored in the database. Though most of the time users will not notice this trigger, it will ensure bad data is not allowed into the tables and then shown to users. 



7. **Each team member should describe one technical challenge that the team encountered. This should be sufficiently detailed such that another future team could use this as helpful advice if they were to start a similar project or where to maintain your project.**
    * Alex O: 
        * Encountered front-end issues such as dividing the various queries onto various pages and still being able to get to previous pages. The way that this was solved was by adding a navigation bar to the top of every page and also using various html "views" pages. The navigation bar would then take you to the respective views page which allowed for a cleaner UI look. The user was no longer confronted with all of the queries/functionalities on one page but rather they were all split up depending on the specific need.
    * Alex C:
        * When we separated our original database into multiple tables,  we decided to split up the work and have each person separate out one or two tables each. However, once we uploaded all the .csv files to the database, our tables would not join. As it turned out, some of the .csv files were generated with different line endings, causing them to not match correctly on join statements. Regenerating all the .csv files all on the same computer solved this issue.
    * Jacob S:
        * Our team had some trouble with some small syntax/formatting issues when working with SQL. One instance of this happened when we wrote our advanced queries and put them in our project report (on Google docs), which uses a different character for quotation marks (""). Pasting these into the SQL console caused some nasty errors that took us some time to figure out. 
    * Tianshun G: 
        * Had trouble updating our google map when inserting new records because of the way in which our map is implemented. Our map is initialized everytime when the webpage is reloaded. So when receiving a record to insert, our program will send back a response message by default to tell a user that the record is successfully inserted, which leads to the webpage being reloaded and new records not updated.


8. **Are there other things that changed comparing the final application with the original proposal?**
    * Originally, we planned to use GeoPandas for the map element of our project and to use Django for our front-end. Ultimately, we ended up switching our front-end to React, so we also switched to using the Google Maps JavaScript API for the map instead.


9. **Describe future work that you think, other than the interface, that the application can improve on**
    * We would like to make the map dynamically update with additional records by communicating with our database and find a way to store our map because our current implementation takes too long to re-render.
    * Time permitted, we would like to add other tables with new information like weather in LA or even data from other cities
    * Allow users to report incidents from the app (have to be authorized before adding to database)
    * User accounts (would enable the above feature)
    * We would like to add many more triggers (just like the one we added to check valid addresses), so that multiple checks are in place when incidents are added to the database, all fields (properties) are confirmed to be valid.

10. **Describe the final division of labor and how well you managed teamwork.**
    * Alex O: 
        * Primarily worked on the front-end and putting the website together.
    * Alex C:
        * Wrote stored procedure and trigger, wrote some of our advanced queries, design aspects, video edit. 
    * Jacob S:
        * Set up database, tested table indices, stored procedure, trigger on MySQL.
    * Tianshun G:
        * Implemented the creative component, which is a google map showing all crimes.

We managed teamwork by consistently planning frequent short meetings to regroup, discuss progress, and subdivide tasks. Since everyone had different amounts of work to do for other classes each week, these repeated check-ins ensured that each person had something to work on at all times and provided a sort of mini deadline for group members to get work done.

<!-- 
# points for video
### Short desc of what our website does 
- Convenient, interactive way of viewing crime data in LA without the hassle of sifting through a CSV yourself 
- Visual and text-based outputs for easy comprehension, e.g. in-built satellite view from Google map
- target audience: police, LA residents, tourists (don't need to know place names to see crime patterns)

### Home
- multiple search criteria: have the ability to search by code, date, address
- can see number of crimes in a given month/year
### Modify Data
- Can change the records if we inserted wrong info before or information is outdated or incomplete
### Crime Area Overview
- map marker coloring - aggregate data shows intensity of crime in certain areas when zoomed out 
- crime details on marker click
- list of total crimes for each Area for reference -->