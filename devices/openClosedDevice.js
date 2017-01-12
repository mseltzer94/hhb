"use strict";
var hhbDevice = require('./hhbDevice').default;
var deviceStateMap = {
  '01': 'Closed',
  '02': 'Open',
	'FF': 'Unknown'
}
class openClosedDevice extends hhbDevice {
  constructor(deviceLine){
    super(deviceLine);
    this.update();
  }
  update(){
    this.deviceType = 'openClosedDevice';
    this.deviceState = deviceStateMap[this.deviceState];
  }
}

exports.default = openClosedDevice;
