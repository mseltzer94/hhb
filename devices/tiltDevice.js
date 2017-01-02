"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  0: 'Closed',
  1: 'Open'
}
class tiltDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update(deviceLine);
		return this;
  }
  update(deviceLine){
    this.deviceState = deviceStateMap[parseInt(this.deviceState)];
  }
}

exports.default = tiltDevice;
