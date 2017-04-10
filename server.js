var express = require('express');
// var pg = require('pg');

var app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', function (req, res) {
  res.render('index', {
      title: 'hello world',
      list: ['a', 'b']
  });
});

app.get('/user', function (req, res) {
  res.render('user');
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
