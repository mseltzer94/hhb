"use strict";
var stateTable = require('./stateTable').params;

class hhbDevice {
  constructor(deviceLine){
    deviceLine = deviceLine.replace('STATE=','');
    deviceLine = deviceLine.replace(/\"/g,'');
    var device = deviceLine.split(',');
    for (var i=0; i < stateTable.length; i++){
      this[stateTable[i]] = device[i];
    }
  }
}

exports.default = hhbDevice;
