"use strict";
var _ = require('lodash');
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');
var alerting = require('./alerts/alert.json');
var mailer = require('./alerts/mailer');
var alertManager = require('./alerts/alertManager');

const DELAY = 1000; //msec
const SERIAL_PORT = '/dev/ttyUSB0';

var devices = []; //current device info
var devicesLastRead = []; //last read device info

//timestep 0 - dry
var testDevLine = 'STATE="02,00,0040,0005,02,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Water Sensor"';
var testDev = deviceManager.createDevice(testDevLine);
devices[testDev.macAddress] = testDev;
manageAlerts();
devicesLastRead[testDev.macAddress] = testDev;

//timestep 1 - wet
var testDevLine = 'STATE="02,00,0040,0005,01,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Water Sensor"';
var testDev = deviceManager.createDevice(testDevLine);
devices[testDev.macAddress] = testDev;
manageAlerts();
devicesLastRead[testDev.macAddress] = testDev;

//timestep 1 - wet
var testDevLine = 'STATE="02,00,0040,0005,01,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Water Sensor"';
var testDev = deviceManager.createDevice(testDevLine);
devices[testDev.macAddress] = testDev;
manageAlerts();
devicesLastRead[testDev.macAddress] = testDev;

//timestep 1 - dry
var testDevLine = 'STATE="02,00,0040,0005,02,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Water Sensor"';
var testDev = deviceManager.createDevice(testDevLine);
devices[testDev.macAddress] = testDev;
manageAlerts();
devicesLastRead[testDev.macAddress] = testDev;



function manageAlerts() {
  alerting.alerts.forEach(function(alert){
    // send on alarm match or alarm match resolve
    var oldState = _.get(devicesLastRead, `${alert.macAddress}.${alert.alertField}`);
    var newState = _.get(devices, `${alert.macAddress}.${alert.alertField}`);
    var isChangeDetected = (!oldState || !newState) ? false : newState.toUpperCase() != oldState.toUpperCase()
    var isAlarmMatch = (!newState) ? false : newState.toUpperCase() == alert[alert.alertField].toUpperCase();
    var shouldSendOnResolve = _.get(alert, 'sendOnResolve');
    //console.log(`Old State: ${oldState} |  New State: ${newState}`)
    //console.log(`isChangeDetected: ${isChangeDetected} |  isAlarmMatch: ${isAlarmMatch} | shouldSendOnResolve: ${shouldSendOnResolve}`)
    if (isChangeDetected &&(isAlarmMatch || shouldSendOnResolve)){
      //console.log(`Sending ${(isAlarmMatch ? "New Alert": "Resolved")}: ${alert.message}`)
      alertManager.sendAlert(`${(isAlarmMatch ? "New Alert": "Resolved")}: ${alert.message}`, `${new Date()}: ${alert.message} \n Details: ${JSON.stringify(devices[alert.macAddress])}`);
    }
  });
}
