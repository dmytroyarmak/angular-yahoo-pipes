/*! angular-yahoo-pipes - v0.0.0 - 2014-11-03
* Copyright (c) 2014 Dmytro Yarmak <dmytroyarmak@gmail.com>; Licensed MIT */
angular.module('dyYahooPipes', []);

angular.module('dyYahooPipes').constant(
  'DY_YAHOO_PIPES_URL_PATTERN',
  'http://pipes.yahoo.com/pipes/pipe.run?_render=json&_id=PIPE_ID&_callback=JSON_CALLBACK'
);

angular.module('dyYahooPipes').constant(
  'DY_YAHOO_PIPES_PARSE_FUNCTIONS',
  {
    title: function(item) {
      return item.title;
    },
    description: function(item) {
      return item.description
        .replace(/(<([^>]+)>)/ig, '')
        .replace(/(&[^;]+;)/ig, '')
        .replace('Read More', '');
    },
    link: function(item) {
      return item.link;
    },
    imageUrl: function(item) {
      var images = item['media:thumbnail'],
          firstImage = angular.isArray(images) ? images[0] : images;

      return firstImage.url
        .replace(/w=[0-9]+/, 'w=420')
        .replace(/h=[0-9]+/, 'h=316');
    }
  }
);

angular.module('dyYahooPipes').constant('DY_YAHOO_PIPES_DEFAULT_COUNT', 10);

angular.module('dyYahooPipes').factory('dyYahooPipesParser', ['DY_YAHOO_PIPES_PARSE_FUNCTIONS', function(DY_YAHOO_PIPES_PARSE_FUNCTIONS) {
  return {
    parseItem: function(item) {
      return Object.keys(DY_YAHOO_PIPES_PARSE_FUNCTIONS).reduce(function(result, key) {
        result[key] = DY_YAHOO_PIPES_PARSE_FUNCTIONS[key](item);
        return result;
      }, {});
    },

    parseResponseData: function (responseData, count) {
      var rawItems;

      if (responseData.value && responseData.value.items) {
        rawItems = responseData.value.items.slice(0, count);
        return rawItems.map(this.parseItem);
      } else {
        return [];
      }
    }
  };
}]);

angular.module('dyYahooPipes').factory('dyYahooPipesFetcher', ['$http', '$q', 'DY_YAHOO_PIPES_URL_PATTERN', 'DY_YAHOO_PIPES_DEFAULT_COUNT', 'dyYahooPipesParser', function($http, $q, DY_YAHOO_PIPES_URL_PATTERN, DY_YAHOO_PIPES_DEFAULT_COUNT, dyYahooPipesParser) {
  return {
    fetch: function (pipeId, count) {
      var url = DY_YAHOO_PIPES_URL_PATTERN.replace('PIPE_ID', pipeId);
      return $http.jsonp(url).then(function(response) {
        return dyYahooPipesParser.parseResponseData(response.data, count || DY_YAHOO_PIPES_DEFAULT_COUNT);
      });
    }
  };
}]);

angular.module('dyYahooPipes').directive('dyYahooPipes', function() {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: 'angular-yahoo-pipes.tpl.html',
    scope: {
      pipeId: '@',
      loadingText: '@',
      emptyText: '@',
      linkText: '@',
      count: '='
    },
    controller: ['$scope', 'dyYahooPipesFetcher', function($scope, dyYahooPipesFetcher) {
      $scope.styleFor = function(item) {
        return {
          'background-image': 'url(' + item.imageUrl + ')'
        };
      };

      $scope.isActive = function(item) {
        return $scope.active === item;
      };

      $scope.setActive = function(item) {
        $scope.active = item;
      };

      $scope.isLoading = function() {
        return $scope.items == null;
      };

      $scope.isEmpty = function() {
        return $scope.items && !$scope.items.length;
      };

      dyYahooPipesFetcher.fetch($scope.pipeId, $scope.count).then(function(items) {
        $scope.items = items;
      });
    }]
  };
});

angular.module('dyYahooPipes').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('angular-yahoo-pipes.tpl.html',
    "<div class=\"dy-yahoo-pipes\" ng-class=\"{'is-loading': isLoading(), 'is-empty': isEmpty()}\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div ng-if=\"!isLoading() && isEmpty()\">\r" +
    "\n" +
    "    <p class=\"dy-yahoo-pipes-notice\">{{emptyText || 'There are no items in current pipe...'}}</p>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div ng-if=\"isLoading()\">\r" +
    "\n" +
    "    <p class=\"dy-yahoo-pipes-notice\">{{loadingText || 'Pipe is beeing loaded...'}}</p>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "  <div\r" +
    "\n" +
    "    class=\"dy-yahoo-pipes-item\"\r" +
    "\n" +
    "    ng-style=\"styleFor(item)\"\r" +
    "\n" +
    "    ng-class=\"{'is-active': isActive(item)}\"\r" +
    "\n" +
    "    ng-click=\"setActive(item)\"\r" +
    "\n" +
    "    ng-repeat=\"item in items\"\r" +
    "\n" +
    "  >\r" +
    "\n" +
    "    <h3 class=\"dy-yahoo-pipes-item-title\">{{item.title}}</h3>\r" +
    "\n" +
    "    <p class=\"dy-yahoo-pipes-item-description\">{{item.description}}</p>\r" +
    "\n" +
    "    <a class=\"dy-yahoo-pipes-item-link\" ng-href=\"{{item.link}}\">{{linkText || 'Read more...'}}</a>\r" +
    "\n" +
    "  </div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
