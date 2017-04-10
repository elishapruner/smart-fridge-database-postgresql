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

var userRouter = express.Router();
userRouter.route('/user')
  .get(function (req, res) {
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
app.use(userRouter);


var chefRouter = express.Router();
chefRouter.route('/chef')
  .get(function (req, res) {
    res.render('chef');
  })
  .post(function (req, res) {
    pg.connect(connectDB, function(err, client, done) {
      if (err) {
        return console.error('error in fetching client', err);
      }
      client.query('SELECT mealid FROM smartfridge.meal ORDER BY mealid DESC LIMIT 1', function (err, mealID) {
        if (err) {
          return console.error('error running query', err);
        }
        var maxID = parseInt(mealID.rows[0].mealid);
        client.query('INSERT INTO smartfridge.meal(mealid, name) VALUES($1, $2)',
          [maxID+1, req.body.meal_name]);
        done();
        res.redirect('/chef');
      });
    });
  });
app.use(chefRouter);


app.get('/admin', function (req, res) {
  res.render('admin');
});

app.listen(3000, function () {
  console.log('Running server on port 3000');
});
