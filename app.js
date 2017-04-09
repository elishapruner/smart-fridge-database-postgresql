var express = require('express');
var app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/user', function (req, res) {
  res.sendFile(__dirname + '/public/user.html');
});

app.get('/chef', function (req, res) {
  res.sendFile(__dirname + '/public/chef.html');
});

app.get('/admin', function (req, res) {
  res.sendFile(__dirname + '/public/admin.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
