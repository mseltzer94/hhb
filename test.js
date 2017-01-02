"use strict";
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');
var alerting = require('./alerts/alert.json');
var mailer = require('./alerts/mailer');
var alertManager = require('./alerts/alertManager');

const DELAY = 1000; //msec
const SERIAL_PORT = '/dev/ttyUSB0';

var devices = [];

var testDevLine = 'STATE="02,00,0040,0005,01,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Water Sensor"';
var testDev = deviceManager.createDevice(testDevLine);
devices[testDev.macAddress] = testDev;
alerting.alerts.forEach(function(alert){
  if (devices[alert.macAddress].deviceState.toUpperCase() == alert.deviceState.toUpperCase()){
    alertManager.sendAlert(alert.message);
  }

});
