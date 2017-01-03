"use strict";
var _ = require('lodash');
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');
var alerting = require('./alerts/alert.json');
var mailer = require('./alerts/mailer');
var alertManager = require('./alerts/alertManager');
var log4js = require('log4js');

log4js.loadAppender('file');
log4js.addAppender(log4js.appenders.file('logs/hhb.log'), 'hhb');
var logger = log4js.getLogger('hhb');
logger.setLevel('INFO');

const DELAY = 1000; //msec
const RETRYDELAY = 5000;
const LOGDELAY = 20000;
const SERIAL_PORT = '/dev/ttyUSB0';

//hash table of devices, MAC address is the key
var devices = []; //current device info
var devicesLastRead = []; //last read device info
var hhbStatus = "Not Ready"
var hhbErrorMessage = null;
var attempt = 0;
var isVacationMode = process.env.ISVACATIONMODE;

if (isVacationMode){
  console.log("Vacation Mode Enabled")
} else {
  console.log("Vacation Mode Disabled")
}

var port = new SerialPort(SERIAL_PORT, { autoOpen: false, baudRate:38400, parser: SerialPort.parsers.readline('\n') });

function connectToHhb(){
  port.open(function (err) {
    if (err) {
      hhbErrorMessage = `Error opening port: ${err.message}. Attempt ${attempt}`;
      attempt++;
      //retry every second
      setInterval(function(){ connectToHhb()}, RETRYDELAY);
    } else {
      console.log("Connected to HHB");
      hhbStatus = "Ready. Connected to HHB";
      port.on('data', function (data) {
          if (data != "STATE=NEW" && data != "STATE=DONE" && data.split(',').length == 17){
            var dev = deviceManager.createDevice(data);
						if (dev && dev.macAddress){
							devices[dev.macAddress] = dev;
            	manageAlerts();
            	devicesLastRead[dev.macAddress] = dev;
						}
          }
      });

      setInterval(function(){port.write('S')}, DELAY);
    }
  });
}

function manageAlerts() {
  alerting.alerts.forEach(function(alert){
    // send on alarm match or alarm match resolve
    var oldState = _.get(devicesLastRead, `${alert.macAddress}.${alert.field}`);
    var newState = _.get(devices, `${alert.macAddress}.${alert.field}`);
    var isStartup = !oldState && newState;
    var isChangeDetected = (!oldState || !newState) ? false : newState.toUpperCase() != oldState.toUpperCase()
    var isAlarmMatch = (!newState) ? false : newState.toUpperCase() == alert.fieldContents.toUpperCase();
    var shouldSendOnResolve = _.get(alert, 'sendOnResolve');
    var isVacationOnly = _.get(alert, 'isVacationOnly');
    if (isChangeDetected &&(isAlarmMatch || shouldSendOnResolve) || (isStartup && isAlarmMatch)){
      if ((isVacationOnly && isVacationMode) || !isVacationOnly){
        alertManager.sendAlert(`${(isAlarmMatch ? "New Alert": "Resolved")}: ${alert.message}`, `${new Date()}: ${alert.message} \n Details: ${JSON.stringify(devices[alert.macAddress])}`);
      }
    }
  });
  //generic monitoring (across all devices)
  var genericAlarms = [{
    "field": "deviceAlerts",
    "fieldContents": "Low Battery",
    "message": "Low Battery",
    "sendOnResolve": true
  },
  {
    "field": "deviceAlerts",
    "fieldContents": "Device Offline",
    "message": "Device Offline",
    "sendOnResolve": true
  }];
  var deviceAddrs = _.keys(devices);
  genericAlarms.forEach(function(alert){
    deviceAddrs.forEach(function(macAddress){
      var oldState = _.get(devicesLastRead, `${macAddress}.${alert.field}`);
      var newState = _.get(devices, `${macAddress}.${alert.field}`);
      var isStartup = !oldState && newState;
      var isChangeDetected = (!oldState || !newState) ? false : newState.toUpperCase() != oldState.toUpperCase();
      var isAlertMatch = (!newState) ? false : newState.toUpperCase() == alert.fieldContents.toUpperCase();
      var shouldSendOnResolve = _.get(alert, 'sendOnResolve');
      var isVacationOnly = _.get(alert, 'isVacationOnly');
      if (isChangeDetected &&(isAlarmMatch || shouldSendOnResolve) || (isStartup && isAlertMatch)){
        if ((isVacationOnly && isVacationMode) || !isVacationOnly){
          alertManager.sendAlert(`Device Alert (${devices[macAddress].deviceName}): ${newState}`, `${new Date()}: ${newState} \n Details: ${JSON.stringify(devices[macAddress])}`);
        }
      }
    });
  });
}
var lastLogged = [];
setTimeout(function(){
  var deviceAddrs = _.keys(devices);
  deviceAddrs.forEach(function(macAddress){
      var oldState = _.get(lastLogged, `${macAddress}.deviceState`);
      var newState = _.get(devices, `${macAddress}.deviceState`);
      if (!oldState || (newState && newState.toUpperCase() != newState.toUpperCase())){
        logger.info(devices[macAddress].deviceName);
        logger.info("CHANGE: " + oldState + "->" + newState);
      }
      lastLogged[macAddress] = devices[macAddress];
  })
}, LOGDELAY);

exports.getDevices = function(){
  return _.values(devices);
}
exports.getStatus = function(){
  return hhbStatus;
}
exports.getErrorMessage = function(){
  return hhbErrorMessage;
}
exports.connectToHhb = connectToHhb;
