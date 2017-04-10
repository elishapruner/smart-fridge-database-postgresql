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

app.post('/filter_food', function(req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT * FROM smartfridge.fooditem WHERE name=$1 OR category=$1', [req.body.food_input], function(err, food) {
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

app.post('/filter_meal', function(req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT * FROM smartfridge.fooditem', function(err, food) {
      if (err) {
        return console.error('error running query', err);
      }
      client.query('SELECT * FROM smartfridge.meal WHERE name=$1 OR cuisine=$1', [req.body.meal_input], function(err, meal) {
        if (err) {
          return console.error('error running query', err);
        }
        res.render('user', {fooditem: food.rows, meal: meal.rows});
      });
      done();
    });
  });
});

app.post('/request_food', function (req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT requestid FROM smartfridge.request ORDER BY requestid DESC LIMIT 1', function (err, requestID) {
      if (err) {
        return console.error('error running query', err);
      }
      var maxID = parseInt(requestID.rows[0].reqid);
      console.log(maxID);
      // client.query('INSERT INTO smartfridge.foodrequest(foodreqid, foodid, reguserid) VALUES($1, $2, $3)',
      //   [maxID + 1, req.body.foodID, req.body.userID]);
      // done();
      // res.redirect('/user');
    });
  });
});

app.post('/request_meal', function (req, res) {
  // pg.connect(connectDB, function(err, client, done) {
  //   if (err) {
  //     return console.error('error in fetching client', err);
  //   }
  //   client.query('SELECT requestid FROM smartfridge.request ORDER BY requestid DESC LIMIT 1', function (err, requestID) {
  //     if (err) {
  //       return console.error('error running query', err);
  //     }
  //     var maxID = parseInt(requestID.rows[0].reqid);
  //     client.query('INSERT INTO smartfridge.foodrequest(foodreqid, foodid, reguserid) VALUES($1, $2, $3)',
  //       [maxID + 1, req.body.foodID, req.body.userID]);
  //     done();
  //     res.redirect('/user');
  //   });
  // });
});

app.get('/chef', function (req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT * FROM smartfridge.meal', function(err, meal) {
      if (err) {
        return console.error('error running query', err);
      }
      res.render('chef', {meal: meal.rows});
      done();
    });
  });
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
      client.query('INSERT INTO smartfridge.meal(mealid, name, cuisine, description) VALUES($1, $2, $3, $4)',
        [maxID + 1, req.body.meal_name, req.body.meal_cuisine, req.body.meal_description]);
      done();
      res.redirect('/chef');
    });
  });
});

app.post('/chef_place_order', function (req, res) {
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

app.post('/filter_chef_report', function(req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT * FROM smartfridge.fooditem', function(err, food) {
      if (err) {
        return console.error('error running query', err);
      }
      client.query('SELECT * FROM smartfridge.meal WHERE name=$1 OR cuisine=$1', [req.body.chef_report_input], function(err, meal) {
        if (err) {
          return console.error('error running query', err);
        }
        res.render('chef', {meal: meal.rows});
      });
      done();
    });
  });
});

app.get('/admin', function (req, res) {
  pg.connect(connectDB, function(err, client, done) {
    if (err) {
      return console.error('error in fetching client', err);
    }
    client.query('SELECT orderid, name, category, count, priceperitem, threshold, approved ' +
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

app.post('/admin_place_order', function (req, res) {
  // pg.connect(connectDB, function(err, client, done) {
  //   if (err) {
  //     return console.error('error in fetching client', err);
  //   }
  //   client.query('SELECT orderid FROM smartfridge.ingredientorder ORDER BY orderid DESC LIMIT 1', function (err, orderID) {
  //     if (err) {
  //       return console.error('error running query', err);
  //     }
  //     var maxID = parseInt(orderID.rows[0].orderid);
  //     client.query('SELECT foodid FROM smartfridge.fooditem WHERE name=$1', [req.body.ingredient], function (err, foodid) {
  //       if (err) {
  //         return console.error('error running query', err);
  //       }
  //       var foodID = parseInt(foodid.rows[0].foodid);
  //       client.query('INSERT INTO smartfridge.ingredientorder(orderid, foodid, chefid, adminid, approved) VALUES ($1, $2, $3, $4, $5)',
  //         [maxID+1, foodID, req.body.chefID, 1, false]);
  //     });
  //     done();
  //     res.redirect('/chef');
  //   });
  // });
});

app.put('/accept', function (req, res) {
  // pg.connect(connectDB, function(err, client, done) {
  //   if (err) {
  //     return console.error('error in fetching client', err);
  //   }
  //   client.query('DELETE FROM smartfridge.ingredientorder WHERE orderid=$1', [data-id]);
  //   done();
  // });
});

app.delete('/reject', function (req, res) {
  // pg.connect(connectDB, function(err, client, done) {
  //   if (err) {
  //     return console.error('error in fetching client', err);
  //   }
  //   client.query('DELETE FROM smartfridge.ingredientorder WHERE orderid=$1', [data-id]);
  //   done();
  // });
});

app.listen(3000, function () {
  console.log('Running server on port 3000');
});

