"use strict";
var SerialPort = require('serialport');
var stateTable = require('./devices/stateTable').params;
var hhbDevice = require('./devices/hhbDevice').default;
var deviceManager = require('./devices/deviceManager');

const DELAY = 1000; //msec
const SERIAL_PORT = '/dev/ttyUSB0';

var testDevLine = 'STATE="02,00,0040,0024,00,12,00,00,0301,12,0000,00,FF,00000000,00,000D6F0000011367,Home Key"';
var testDev = deviceManager.createDevice(testDevLine);
console.log(testDev);
// SerialPort.list(function (err, ports) {
//   ports.forEach(function(port) {
//     console.log(port.comName);
//     console.log(port.pnpId);
//     console.log(port.manufacturer);
//   });
// });
//
//
// port = new SerialPort(SERIAL_PORT, { autoOpen: false, baudRate:38400, parser: SerialPort.parsers.readline('\n') });
//
//
//
// port.open(function (err) {
//   if (err) {
//     return console.log('Error opening port: ', err.message);
//   }
//   setInterval(function(){port.write('S')}, DELAY);
// });
//
// port.on('data', function (data) {
//        	data.replace(/\"/g,'')
//        	var line = data.split(',');
//        	console.log('id:',line[15]);
//        	console.log('name:',line[16]);
// });
