"use strict";
const BASE_STATION_DEVICE_TYPE = '0001';
const HOME_KEY_DEVICE_TYPE = '0002';
const OPEN_CLOSED_DEVICE_TYPE = '0003';
const POWER_DEVICE_TYPE = '0004';
const WATER_DEVICE_TYPE = '0005';
const REMINDER_DEVICE_TYPE = '0006';
const ATTENTION_DEVICE_TYPE = '0007';
const MODEM_DEVICE_TYPE = '0010';
const MOTION_DEVICE_TYPE = '0017';
const TILT_DEVICE_TYPE = '0018';

var hhbDevice = require('./hhbDevice').default;
var tiltDevice = require('./tiltDevice').default;
var waterDevice = require('./waterDevice').default;
var openClosedDevice = require('./openClosedDevice').default;

function createDevice(deviceLine){
  var generic = new hhbDevice(deviceLine);
  if (generic.deviceType == TILT_DEVICE_TYPE) {
    return new tiltDevice(deviceLine);
  } if (generic.deviceType == WATER_DEVICE_TYPE){
    return new waterDevice(deviceLine);
  } if (generic.deviceType == OPEN_CLOSED_DEVICE_TYPE){
    return new openClosedDevice(deviceLine);
  } else {
    return generic;
  }
}

exports.createDevice = createDevice;
