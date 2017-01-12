angular.module('hhb', ['ngMaterial'])
.controller('AppCtrl', function($scope, $http) {
  $scope.isSettingVacationMode = false;
  $scope.failedSettingVacationMode = false;
  $scope.showAlertRules = false;
  $scope.alertRules = [];

  $scope.params = [
    'stateRecordID',      //Field 1
    'zigBeeBindingID',    //Field 2
    'deviceCapabilities', //Field 3
    'deviceType',         //Field 4
    'deviceState',        //Field 5
    'deviceStateTimer',   //Field 6
    'deviceAlerts',       //Field 7
    'deviceNameIndex',    //Field 8
    'deviceConfiguration',//Field 9
    'aliveUpdateTimer',   //Field 10
    'updateFlags',        //Field 11
    'undefined1',         //Field 12
    'deviceParameter',    //Field 13
    'undefined2',         //Field 14
    'pendingUpdateTimer', //Field 15
    'macAddress',         //Field 16
    'deviceName'          //Field 17
  ];

  //polling
  setInterval(function(){$scope.getDevices()}, 5000);

  $scope.getDevices = function(){
    $http.get('/api').then(function(res){
      $scope.updated = true;
      $scope.devices = [ {
    'stateRecordID': '02',
    'zigBeeBindingID': '00',
    'deviceCapabilities': '0040',
    'deviceType': '0005',
    'deviceState': 'Dry',
    'deviceStateTimer': '12',
    'deviceAlerts': 'None',
    'deviceNameIndex': '00',
    'deviceConfiguration': '0301',
    'aliveUpdateTimer': '12',
    'updateFlags': '0000',
    'undefined1': '00',
    'deviceParameter': 'FF',
    'undefined2': '00000000',
    'pendingUpdateTimer': '00',
    'macAddress': '000D6F000000ABD4',
    'deviceName': 'Water Sensor' },
    {
  'stateRecordID': '02',
  'zigBeeBindingID': '00',
  'deviceCapabilities': '0040',
  'deviceType': '0005',
  'deviceState': 'Dry',
  'deviceStateTimer': '12',
  'deviceAlerts': 'None',
  'deviceNameIndex': '00',
  'deviceConfiguration': '0301',
  'aliveUpdateTimer': '12',
  'updateFlags': '0000',
  'undefined1': '00',
  'deviceParameter': 'FF',
  'undefined2': '00000000',
  'pendingUpdateTimer': '00',
  'macAddress': '000D6F000000DA3A',
  'deviceName': 'Front door' }];
      //$scope.devices = res.data.devices;
      $scope.isVacationMode = res.data.isVacationMode;
      $scope.lastContact = res.data.lastContact;
      $scope.status = res.data.status;
    },
    function(res){
      $scope.updated = false;
    });
  }

  $scope.getAlertRules = function(){
    $scope.alertRules = [];
    $http.get('/api/alertRules').then(function(res){
      res.data.alerts.forEach(function(alert){
        if (!$scope.alertRules[alert.macAddress]){
          $scope.alertRules[alert.macAddress] = [];
        }
        $scope.alertRules[alert.macAddress].push(alert);
      })
    });

  }

  $scope.isReady = function (){
    return $scope.status == "Active";
  }

  $scope.toggleAlertRules = function(){
    $scope.showAlertRules = !$scope.showAlertRules;
    if ($scope.showAlertRules){
      $scope.getAlertRules();
    }
  }

  $scope.getLiveStatus = function(){
    if ($scope.updated){
      return 'Live';
    } else {
      return 'Failed to update'
    }
  }

  $scope.addRule = function(macAddress){
    $scope.alertRules[macAddress].push({'macAddress':macAddress});
  }

  $scope.saveRules = function(){
    $scope.isSendingRules = true;
    var rules = []
    for (var macAddress in $scope.alertRules){
      $scope.alertRules[macAddress].forEach(function(alert){
        rules.push(alert);
      })
    }
    $http.post('/api/alertRules', {'alerts':rules}).then(function sucess(res){
      $scope.isSendingRules = false;
    }, function failed(res){
      $scope.isSendingRules = false;
    });
  }

  $scope.setVacationMode = function(){
    $scope.isSettingVacationMode = true;
    $http.post('/api/setVacationMode', JSON.stringify({'isVacationMode':!$scope.isVacationMode})).then(function(res){
      $scope.getDevices();
      $scope.isSettingVacationMode = false;
      $scope.failedSettingVacationMode = false;
    },
    function(res){
      $scope.failedSettingVacationMode = true;
      $scope.isSettingVacationMode = false;
    });
  }
});
