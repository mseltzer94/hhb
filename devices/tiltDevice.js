"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  '01': 'Closed',
  '02': 'Open',
	'FF': 'Unknown'
}
class tiltDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update();
  }
  update(){
    this.deviceType = 'tiltDevice';
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = tiltDevice;
