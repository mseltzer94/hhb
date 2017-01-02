"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  1: 'Wet',
  2: 'Dry'
}
class waterDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update(deviceLine);
  }
  update(deviceLine){
    this.deviceState = deviceStateMap[parseInt(this.deviceState)];
  }
}

exports.default = waterDevice;
