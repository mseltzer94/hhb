"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  '00': 'None',
	'FF': 'Unknown'
}
class homeKeyDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update();
  }
  update(){
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = homeKeyDevice;
