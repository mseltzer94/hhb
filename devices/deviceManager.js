"use strict";
const BASE_STATION_DEVICE_TYPE = 1;
const HOME_KEY_DEVICE_TYPE = 2;
const OPEN_CLOSED_DEVICE_TYPE = 3;
const POWER_DEVICE_TYPE = 4;
const WATER_DEVICE_TYPE = 5;
const REMINDER_DEVICE_TYPE = 6;
const ATTENTION_DEVICE_TYPE = 7;
const MODEM_DEVICE_TYPE = 16;
const MOTION_DEVICE_TYPE = 23;
const TILT_DEVICE_TYPE = 24;

var hhbDevice = require('./hhbDevice').default;
var tiltDevice = require('./tiltDevice').default;

function createDevice(deviceLine){
  var generic = new hhbDevice(deviceLine);
  if (generic.deviceType == TILT_DEVICE_TYPE) {
    return new tiltDevice(deviceLine);
  } else {
    return generic;
  }
}

exports.createDevice = createDevice;
