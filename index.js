"use strict";
var SerialPort = require('serialport');
var deviceManager = require('./devices/deviceManager');

const DELAY = 1000; //msec
const SERIAL_PORT = '/dev/ttyUSB0';

//hash table of devices, MAC address is the key
var devices = [];
// SerialPort.list(function (err, ports) {
//   ports.forEach(function(port) {
//     console.log(port.comName);
//     console.log(port.pnpId);
//     console.log(port.manufacturer);
//   });
// });
//
//
var port = new SerialPort(SERIAL_PORT, { autoOpen: false, baudRate:38400, parser: SerialPort.parsers.readline('\n') });
port.open(function (err) {
  if (err) {
    return console.log('Error opening port: ', err.message);
  }
  setInterval(function(){port.write('S')}, DELAY);
});

port.on('data', function (data) {
    var dev = deviceManager.createDevice(data);
    devices[dev.macAddress];
    devices.push(dev);
    console.log(devices);
});
