var express = require('express');
// var pg = require('pg');

var app = express();
// var router = express.Router();
//
// var connectionString = 'postgres://postgres:password@localhost/postgres';
//
// var client = new pg.Client(connectionString);
// client.connect();

// app.set('view engine', 'ejs');

// app.use(express.static('public'));

// router.get('/user', function(req, res, next) {
//     pg.connect(connectionString, function(err, client, done) {
//         if (err) {
//             return console.error('error fetching data', err);
//         }
//         console.log("connected to database");
//         client.query('SELECT * FROM smartfridge.user', function(err, result) {
//             done();
//             if (err) {
//                 return console.error('error running query', err);
//             }
//             res.send(result);
//         });
//     });
// });


app.get('/', function (req, res) {
    res.send("hello world")
  // res.sendFile(__dirname + '/public/index.ejs');
});

// app.get('/user', function (req, res) {
//   res.sendFile(__dirname + '/public/user.ejs');
// });
//
// app.get('/chef', function (req, res) {
//     res.sendFile(__dirname + '/public/chef.ejs');
// });
//
// app.get('/admin', function (req, res) {
//   res.sendFile(__dirname + '/public/admin.ejs');
// });

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
