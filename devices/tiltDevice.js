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
    this.update();
  }
  update(){
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = tiltDevice;
