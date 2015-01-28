var ViewCtrl = function ($scope) {
  $scope.testVar = 'We are up and running from a required module!';
  console.log('ViewCtrl ' + $scope.testVar);
};

module.exports = ViewCtrl;