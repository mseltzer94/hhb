"use strict";
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');

const DELAY = 1000; //msec
const SERIAL_PORT = '/dev/ttyUSB0';

var devices = [];

var testDevLine = 'STATE="02,00,0040,0024,00,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Home Key"';
var testDev = deviceManager.createDevice(testDevLine);
console.log(testDev);
