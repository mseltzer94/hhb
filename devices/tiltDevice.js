"use strict";
var hhbDevice = require('./hhbDevice').default;
class tiltDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
  }
}

exports.default = tiltDevice;
