var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.68.67.223',
                user: 'root',
                password: '1234',
                database: 'cs411project'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'Crime in LA' });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Success'});
});


// this code is executed when a user clicks on the form insert button
app.post('/inserts', function(req, res) {
  var update = req.body.input;
  var array = update.split(',');
  var dRNumber = array[0];
  var time = array[1];
  var date = array[2];
  var code = array[3];
  var address = array[4];
   
  var sql = `INSERT INTO Incident (DRNumber, Time, Date, Code, Address) VALUES ('${dRNumber}','${time}','${date}','${code}','${address}')`;

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/success');
  });
});


// this code is executed when a user clicks the form search button
app.get('/search', function(req, res) {
  const date = req.query.date;
  console.log('date:', date);

  const sql = `SELECT * From Incident Incident WHERE Date='${date}'`;

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }
    console.log(result);
    res.render('search', { results: result });
  });
});


// this code is executed when a user clicks the form update button
app.get('/update', function(req, res) {
  var update = req.query.address;
  var array = update.split(',');
  var newName = array[0];
  var oldName = array[1];

  const sql = `Update Incident SET Address='${newName}' WHERE Address='${oldName}'`;

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }
    res.redirect('/success');
  });
});

// this code is executed when a user clicks the form delete  button
app.get('/delete', function(req, res) {
  var code = req.query.code;

  const sql = `DELETE FROM Incident WHERE Code = '${code}'`;

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }
    res.redirect('/success');
  });
})

// this is code to execute when a user clicks the advanced query 1 button
app.get('/advanced1', function(req, res) {

  const sql = `SELECT DISTINCT a.Name as AreaName, t.NumIncidents
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
LIMIT 15`;

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }
    console.log(result);
    res.render('advanced1', {results: result});
  });
});


// this is code to execute when a user clicks the advanced query 2 button
app.get('/advanced2', function(req, res) {

  const sql = `SELECT AreaName, COUNT(ReportDistrictCode) AS NumCrimes
FROM Incident i NATURAL JOIN Location l NATURAL JOIN District d
WHERE Date LIKE "%2021%"
GROUP BY AreaName
ORDER BY NumCrimes DESC
LIMIT 15;`;

  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err);
      return;
    }
    console.log(result);
    res.render('advanced2', {results: result});    
  });
});


app.listen(80, function () {
    console.log('Node app is running on port 80');
});
