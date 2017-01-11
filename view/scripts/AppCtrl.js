angular.module('hhb', ['ngMaterial'])
.controller('AppCtrl', function($scope, $http) {
  $scope.isSettingVacationMode = false;
  $scope.failedSettingVacationMode = false;
  $scope.showAlertRules = false;
  $scope.alertRules = [];

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
      $scope.alertRules = [];
    },
    function(res){
      $scope.updated = false;
    });
  }

  $scope.getAlertRules = function(){
    $http.get('/api/alertRules').then(function(res){
      res.data.alerts.forEach(function(alert){
        $scope.alertRules[alert.macAddress] = alert;
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

  // $scope.getAlertRulesByMacAddress = function(macAddress){
  //   var matches = [];
  //   $scope.alertRules.forEach(function(alertRule){
  //     if (alertRule.macAddress == macAddress){
  //       matches.push(alertRule);
  //     }
  //   });
  //   return matches;
  // }

  $scope.addRule = function(macAddress){
    $scope.alertRules.push({'macAddress':macAddress});
  }

  $scope.saveRules = function(){
    $scope.isSendingRules = true;
    $http.post('/api/alertRules', {'alerts':$scope.alertRules}).then(function sucess(res){
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
