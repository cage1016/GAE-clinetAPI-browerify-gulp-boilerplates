var WelcomeCtrl = function ($scope) {
  $scope.testVar = 'We are up and running from a required module!';
  console.log('WelcomeCtrl ' + $scope.testVar);
};

module.exports = WelcomeCtrl;