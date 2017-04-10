var express = require('express');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

var connectDB = "postgres://postgres:password@localhost/postgres";

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));


app.get('/', function (req, res) {
  res.render('index');
});

app.get('/user', function (req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }

    client.query('SELECT * FROM smartfridge.fooditem', function(err, food) {
      if (err) {
        return console.error('error running query', err);
      }
      client.query('SELECT * FROM smartfridge.meal', function(err, meal) {
        if (err) {
          return console.error('error running query', err);
        }
        res.render('user', {fooditem: food.rows, meal: meal.rows});
      });
      done();
    });

  });
});

app.get('/chef', function (req, res) {
    res.render('chef');
});

app.get('/admin', function (req, res) {
  res.render('admin');
});


app.listen(3000, function () {
  console.log('Running server on port 3000');
});
