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
    var lastContact = homeMonitor.getLastContact();
    var isVacationMode = homeMonitor.getVacationModeStatus();
    res.json({devices: devices, status: status, errorMessage: errorMessage, lastContact:lastContact, isVacationMode:isVacationMode});
});

router.post('/setVacationMode', function(req, res){
  if (req && req.body && req.body.isVacationMode){
    homeMonitor.setVacationModeStatus(req.body.isVacationMode, function(err){
      if (err){
        res.status(500).send('Failed to save vacation status');
      } else {
        res.send(200);
      }
    });
  } else {
    res.send(400);
  }
});

app.use('/api', router);
app.use(express.static(__dirname));

app.listen(port);
console.log('Server ready:' + port);
