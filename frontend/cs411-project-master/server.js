var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var fs = require("fs"); // newly added
var locationData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data.json'))); // newly added
const apiKey = 'AIzaSyB1SwB2sdaFabCLbC-NoJ2rov52JNdt9hQ'; // newly added
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
  res.render('index', { title: 'Crime in LA', apiKey, locationData });
});

app.get('/success', function(req, res) {
      res.send({'message': 'Success'});
});

//function that takes user to home page
function goToHome() {
  window.location.replace('/');
}

// this code is executed when a user visits the modify-data page
app.get('/modify-data', function(req, res) {
  res.render('modify-data', { title: 'Modify Data' });
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
  const searchBy = req.query.searchBy;
  const query = req.query.query;
  let sql;

  switch(searchBy) {
    case "Date":
      sql = `SELECT * FROM Incident WHERE Date='${query}'`;
      break;
    case "Code":
      sql = `SELECT * FROM Incident WHERE Code='${query}'`;
      break;
    case "Address":
      sql = `SELECT * FROM Incident WHERE Address='${query}'`;
      break;
    default:
      res.send('Invalid search category');
      return;
  }

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
    console.log("1");
    res.render('advanced1', {results: result, apiKey, locationData});
  });
});


// this is code to execute when a user clicks on the advanced query 2 button
app.get('/advanced2', function(req, res) {
  const year = req.query.year;
  const month = req.query.month;
  const sql = `call CrimesByDate('${month}','${year}')`;
  connection.query(sql, function(err, data) {
    if (err) {
      res.send(err);
      return;
    }
    console.log(data);
    console.log("2");
    res.render('advanced2', {results: data[0], year: year, month: month});    
  });
});





app.listen(80, function () {
    console.log('Node app is running on port 80');
});
