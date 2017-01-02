"use strict";
var _ = require('lodash');
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');
var alerting = require('./alerts/alert.json');
var mailer = require('./alerts/mailer');
var alertManager = require('./alerts/alertManager');

const DELAY = 1000; //msec
const RETRYDELAY = 5000;
const SERIAL_PORT = '/dev/ttyUSB0';

//hash table of devices, MAC address is the key
var devices = []; //current device info
var devicesLastRead = []; //last read device info
var hhbStatus = "Not Ready"
var hhbErrorMessage = null;
var attempt = 0;

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
    var oldState = _.get(devicesLastRead, `${alert.macAddress}.${alert.alertField}`);
    var newState = _.get(devices, `${alert.macAddress}.${alert.alertField}`);
    var isChangeDetected = (!oldState || !newState) ? false : newState.toUpperCase() != oldState.toUpperCase()
    var isAlarmMatch = (!newState) ? false : newState.toUpperCase() == alert[alert.alertField].toUpperCase();
    var shouldSendOnResolve = _.get(alert, 'sendOnResolve');
    if (isChangeDetected &&(isAlarmMatch || shouldSendOnResolve)){
      alertManager.sendAlert(`${(isAlarmMatch ? "New Alert": "Resolved")}: ${alert.message}`, `${new Date()}: ${alert.message} \n Details: ${JSON.stringify(devices[alert.macAddress])}`);
    }
  });
}

exports.getDevices = function(){
	console.log(devices['000D6F000000ABD4']);
  return _.values(devices);
}
exports.getStatus = function(){
  return hhbStatus;
}
exports.getErrorMessage = function(){
  return hhbErrorMessage;
}
exports.connectToHhb = connectToHhb;
