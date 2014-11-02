angular.module('dyYahooPipes', []).directive('dyYahooPipes', function($http) {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'angular-yahoo-pipes.tpl.html'
  };
});
