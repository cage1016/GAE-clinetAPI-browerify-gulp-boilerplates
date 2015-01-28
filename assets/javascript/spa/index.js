var angular = require('angular');
var route = require('angular-route');
var WelcomeCtrl = require('./controllers/WelcomeCtrl');
var ViewCtrl = require('./controllers/ViewCtrl');

module.exports = {
  init: function () {
    console.log('spa init');

    angular.element(document).ready(function () {
      var app = angular.module('myApp', ['ngRoute', 'MyAwesomePartials']);
      app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
          when('/', {
            templateUrl: '/partialsspa/views/a.html',
            controller: WelcomeCtrl
          }).
          when('/views/:id', {
            templateUrl: '/partialsspa/views/b.html',
            controller: ViewCtrl
          }).
          otherwise({redirectTo: '/'});
      }]);

      angular.bootstrap(document, ['myApp']);
      angular.element('html').addClass('ng-app: myApp');
    });

  }
};