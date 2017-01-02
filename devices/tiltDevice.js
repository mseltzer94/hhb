"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  '02': 'Closed',
  '01': 'Open',
	'FF': 'Unknown'
}
class tiltDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update(deviceLine);
		return this;
  }
  update(deviceLine){
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = tiltDevice;
