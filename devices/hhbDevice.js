"use strict";
var stateTable = require('./stateTable').params;
var deviceAlertMap = {
  '01': 'Alarm Triggered',
  '02': 'Device Offline',
  '04': 'Low Battery'
  '08': 'Battery Charging',
  '20': 'Running On Backup Battery (Base Station Only)'
	'FF': 'Unknown'
}

class hhbDevice {
  constructor(deviceLine){
    deviceLine = deviceLine.replace('STATE=','');
    deviceLine = deviceLine.replace(/\"/g,'');
    var device = deviceLine.split(',');
    for (var i=0; i < stateTable.length; i++){
      this[stateTable[i]] = device[i];
    }
  }
  update(){
    this.deviceAlerts = deviceStateMap[this.deviceAlerts];
  }
}

exports.default = hhbDevice;
