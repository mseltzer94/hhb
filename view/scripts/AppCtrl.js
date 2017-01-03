angular.module('hhb', ['ngMaterial'])
.controller('AppCtrl', function($scope, $http) {
  $scope.isSettingVacationMode = false;
  $scope.failedSettingVacationMode = false;

  //polling
  setInterval(function(){$scope.getDevices()}, 5000);

  $scope.getDevices = function(){
    $http.get('/api').then(function(res){
      $scope.devices = res.data.devices;
      $scope.isVacationMode = res.data.isVacationMode;
      $scope.lastContact = res.data.lastContact;
      $scope.status = res.data.status;
    },
    function(res){
    });
  }

  $scope.isReady = function (){
    console.log($scope.status == "Active");
    return $scope.status == "Active";
  }

  $scope.setVacationMode = function(){
    $scope.isSettingVacationMode = true;
    $http.post('/api/setVacationMode', JSON.stringify({'isVacationMode':!$scope.isVacationMode})).then(function(res){
      console.log("set!");
      $scope.getDevices();
      $scope.isSettingVacationMode = false;
      $scope.failedSettingVacationMode = false;
    },
    function(res){
      console.log("failure!");
      $scope.failedSettingVacationMode = true;
      $scope.isSettingVacationMode = false;
    });
  }
});
