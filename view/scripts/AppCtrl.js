angular.module('hhb', ['ngMaterial'])
.controller('AppCtrl', function($scope, $http) {
  $scope.isSettingVacationMode = false;
  $scope.failedSettingVacationMode = false;

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
      $scope.updated = false;
    });
  }

  $scope.isReady = function (){
    return $scope.status == "Active";
  }

  $scope.getLiveStatus = function(){
    if ($scope.updated){
      return 'Live';
    } else {
      return 'Failed to update'
    }
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
