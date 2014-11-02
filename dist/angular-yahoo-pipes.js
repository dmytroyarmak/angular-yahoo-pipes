/*! angular-yahoo-pipes - v0.0.0 - 2014-11-02
* Copyright (c) 2014 Dmytro Yarmak <dmytroyarmak@gmail.com>; Licensed MIT */
angular.module('dyYahooPipes', []).directive('dyYahooPipes', ['$http', function($http) {
  'use strict';

  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'angular-yahoo-pipes.tpl.html'
  };
}]);

angular.module('dyYahooPipes').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('angular-yahoo-pipes.tpl.html',
    "<div class=\"dy-yahoo-pipes\">\n" +
    "  <pre>Yahoo Pipes!</pre>\n" +
    "</div>\n"
  );

}]);
