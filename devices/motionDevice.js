"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  '01': 'No Motion',
  '02': 'Motion',
	'FF': 'Unknown'
}
class motionDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update();
  }
  update(){
    this.deviceType = 'motionDevice';
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = motionDevice;
