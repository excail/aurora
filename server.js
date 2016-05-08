var express = require('express');
var bodyParser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');

var app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
// render all the static files like css and js
app.use(express.static(__dirname + '/app'));

var api = require('./assets/routes/api')(app, express);
app.use('/api', api);

app.get('*', function (req, res) {
   res.sendFile(__dirname + '/app/index.html');
});

app.listen(config.port, function (error) {
   if (error) {
       console.log(error);
   } else {
       console.log("Listening on port " + config.port);
   }
});

mongoose.connect(config.database, function (error) {
    if (error) {
        console.log(error);
    } else {
        console.log("Connected to the database");
    }
});