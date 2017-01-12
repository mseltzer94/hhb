"use strict";
var _ = require('lodash');
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');
var homeMonitor = require('./homeMonitor');

const SENDDELAY = 5000;
const FRONTENDSERVER = 'http://seltzerhhb.herokuapp.com/';

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
  if (req && req.body && req.body.hasOwnProperty('isVacationMode')){
    homeMonitor.setVacationModeStatus(req.body.isVacationMode, function(err){
      if (err){
        res.status(500).send('Failed to save vacation status');
      } else {
        res.status(200).send();
      }
    });
  } else {
    res.status(400).send();
  }
});

router.post('/alertRules', function(req, res){
  if (req && req.body && req.body.hasOwnProperty('alerts')){
    homeMonitor.setAlertRules(req.body.alerts, function(err){
      if (err){
        res.status(500).send('Failed to save alert rules');
      } else {
        res.status(200).send();
      }
    });
  } else {
    res.status(400).send();
  }
});

router.get('/alertRules', function(req, res){
  res.status(200).send({"alerts" : homeMonitor.getAlertRules()});
  }
);

setInterval(function(){
  var devices = homeMonitor.getDevices();
  var status = homeMonitor.getStatus();
  var errorMessage = homeMonitor.getErrorMessage();
  var lastContact = homeMonitor.getLastContact();
  var isVacationMode = homeMonitor.getVacationModeStatus();
  request.post(FRONTENDSERVER + '/api/updateDeviceData', {form: {devices: devices, status: status, errorMessage: errorMessage, lastContact:lastContact, isVacationMode:isVacationMode}},
  function(err,httpResponse, body){});
}, SENDDELAY);

app.use('/api', router);
app.use(express.static(__dirname));

app.listen(port);
console.log('Server ready:' + port);
