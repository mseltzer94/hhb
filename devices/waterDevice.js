"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  '01': 'Wet',
  '02': 'Dry',
	'FF': 'Unknown'
}
class waterDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update();
  }
  update(){
    this.deviceType = 'waterDevice';
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = waterDevice;
