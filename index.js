"use strict";
var _ = require('lodash');
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');
var alerting = require('./alerts/alert.json');
var mailer = require('./alerts/mailer');
var alertManager = require('./alerts/alertManager');

const DELAY = 1000; //msec
const SERIAL_PORT = '/dev/ttyUSB0';

//hash table of devices, MAC address is the key
var devices = []; //current device info
var devicesLastRead = []; //last read device info

var port = new SerialPort(SERIAL_PORT, { autoOpen: false, baudRate:38400, parser: SerialPort.parsers.readline('\n') });
port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  setInterval(function(){port.write('S')}, DELAY);
});

port.on('data', function (data) {
    if (data != "STATE=NEW"){
      var dev = deviceManager.createDevice(data);
      devices[dev.macAddress] = dev;
      manageAlerts();
      devicesLastRead[dev.macAddress] = dev;
    }
});

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
