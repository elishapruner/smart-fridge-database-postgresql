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

app.post('/meal_form', function (req, res) {
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
        [maxID + 1, req.body.meal_name]);
      done();
      res.redirect('/chef');
    });
  });
});

app.post('/food_form', function (req, res) {
  pg.connect(connectDB, function(err, client, done) {
      if (err) {
        return console.error('error in fetching client', err);
      }
      client.query('SELECT orderid FROM smartfridge.ingredientorder ORDER BY orderid DESC LIMIT 1', function (err, orderID) {
        if (err) {
          return console.error('error running query', err);
        }
        var maxID = parseInt(orderID.rows[0].orderid);
        client.query('SELECT foodid FROM smartfridge.fooditem WHERE name=$1', [req.body.ingredient], function (err, foodid) {
          if (err) {
            return console.error('error running query', err);
          }
          var foodID = parseInt(foodid.rows[0].foodid);
          client.query('INSERT INTO smartfridge.ingredientorder(orderid, foodid, chefid, adminid, approved) VALUES ($1, $2, $3, $4, $5)',
            [maxID+1, foodID, req.body.chefID, 1, false]);
        });
        done();
        res.redirect('/chef');
      });
    });
});

app.get('/admin', function (req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT name, category, count, priceperitem, threshold ' +
      'FROM smartfridge.ingredientorder, smartfridge.fooditem ' +
      'WHERE smartfridge.ingredientorder.foodid=smartfridge.fooditem.foodid', function(err, ingredient) {
      if (err) {
        return console.error('error running query', err);
      }
      res.render('admin', {ingredientorder: ingredient.rows});
      done();
    });
  });
});

app.listen(3000, function () {
  console.log('Running server on port 3000');
});

