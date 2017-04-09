var express = require('express');
var app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.ejs');
});

app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/public/user.ejs');
});

app.get('/chef', function (req, res) {
  res.sendFile(__dirname + '/public/chef.ejs');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/admin.ejs');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
