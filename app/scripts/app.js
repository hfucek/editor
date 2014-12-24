'use strict';

/**
 * @ngdoc overview
 * @name madApp
 * @description
 * # madApp
 *
 * Main module of the application.
 */
angular
  .module('madApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider,$sceProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      
      .otherwise({
        redirectTo: '/'
      });
      
      $sceProvider.enabled(false);
  });
