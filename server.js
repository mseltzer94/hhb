"use strict";
var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var homeMonitor = require('./homeMonitor');

var port = process.env.PORT || 8080;
var router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

homeMonitor.connectToHhb();


router.get('/', function(req, res) {
    var devices = homeMonitor.getDevices();
    var status = homeMonitor.getStatus();
    var errorMessage = homeMonitor.getErrorMessage();
    res.json({devices: devices, status: status, errorMessage: errorMessage});
});

app.use('/api', router);

app.listen(port);
console.log('Server ready:' + port);
