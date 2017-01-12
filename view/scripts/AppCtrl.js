angular.module('hhb', ['ngMaterial'])
.controller('AppCtrl', function($scope, $http, $mdToast) {
  $scope.isSettingVacationMode = false;
  $scope.failedSettingVacationMode = false;
  $scope.showAlertRules = false;
  $scope.alertRules = [];

  $scope.deviceStates = {
    'motionDevice':['motion', 'no motion'],
    'openClosedDevice':['open', 'closed'],
    'tiltDevice':['open', 'closed'],
    'waterDevice':['wet', 'dry'],
  }

  //polling
  setInterval(function(){$scope.getDevices()}, 5000);

  $scope.getDevices = function(){
    $http.get('/api').then(function(res){
      $scope.updated = true;
      $scope.devices = res.data.devices;
      $scope.isVacationMode = res.data.isVacationMode;
      $scope.lastContact = res.data.lastContact;
      $scope.status = res.data.status;
    },
    function(res){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Failed to retrieve device status')
          .hideDelay(3000)
      );
      $scope.updated = false;
    });
  }

  $scope.getAlertRules = function(){
    $scope.isLoadingAlertRules = true;
    $scope.alertRules = [];
    $http.get('/api/alertRules').then(function(res){
      $scope.isLoadingAlertRules = false;
      res.data.alerts.forEach(function(alert){
        if (!$scope.alertRules[alert.macAddress]){
          $scope.alertRules[alert.macAddress] = [];
        }
        $scope.alertRules[alert.macAddress].push(alert);
      })
    }, function(){
      $mdToast.show(
        $mdToast.simple()
          .textContent('Failed to retrieve alert rules')
          .hideDelay(3000)
      );
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
      $mdToast.show(
        $mdToast.simple()
          .textContent('Saved!')
          .hideDelay(3000)
      );
    }, function failed(res){
      $scope.isSendingRules = false;
      $mdToast.show(
        $mdToast.simple()
          .textContent('Failed to save alert rules')
          .hideDelay(3000)
      );
    });
  }

  $scope.setVacationMode = function(){
    $scope.isSettingVacationMode = true;
    $http.post('/api/setVacationMode', JSON.stringify({'isVacationMode':!$scope.isVacationMode})).then(function(res){
      $scope.getDevices();
      $scope.isSettingVacationMode = false;
      $scope.failedSettingVacationMode = false;
      $mdToast.show(
        $mdToast.simple()
          .textContent('Saved!')
          .hideDelay(3000)
      );
    },
    function(res){
      $scope.failedSettingVacationMode = true;
      $scope.isSettingVacationMode = false;
      $mdToast.show(
        $mdToast.simple()
          .textContent('Failed to save vacation mode settings')
          .hideDelay(3000)
      );
    });
  }

  $scope.deleteAlert = function(macAddress, index){
    $scope.alertRules[macAddress].splice(index, 1); //delete 1 element starting from given index
  }
});
