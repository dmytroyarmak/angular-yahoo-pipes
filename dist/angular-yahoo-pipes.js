/*! angular-yahoo-pipes - v0.1.0 - 2014-11-26
* Copyright (c) 2014 Dmytro Yarmak <dmytroyarmak@gmail.com>; Licensed MIT */
'use strict';

/**
 * @ngdoc module
 * @name dyYahooPipes
 * @module dyYahooPipes
 *
 * @description
 * The `dyYahooPipes` contains the `dyYahooPipes` directive with all related constants and services.
 * This module should be added to application's module to use the `dyYahooPipes` directive.
 */
angular.module('dyYahooPipes', []);

/**
 * @ngdoc constant
 * @name DY_YAHOO_PIPES_URL_PATTERN
 * @module dyYahooPipes
 *
 * @description
 * String that store url pattern to make requests to Yahoo Pipes API.
 * It contains placegolders to replace: `PIPE_ID` and `JSON_CALLBACK`.
 */
angular.module('dyYahooPipes').constant(
  'DY_YAHOO_PIPES_URL_PATTERN',
  'http://pipes.yahoo.com/pipes/pipe.run?_render=json&_id=PIPE_ID'
);

/**
 * @ngdoc constant
 * @name DY_YAHOO_PIPES_DEFAULT_COUNT
 * @module dyYahooPipes
 *
 * @description
 * Default number of pipe items to display. It is used when `count` is not
 * passed to the `dyYahooPipes` directive.
 */
angular.module('dyYahooPipes').constant('DY_YAHOO_PIPES_DEFAULT_COUNT', 10);

/**
 * @ngdoc constant
 * @name DY_YAHOO_PIPES_PARSE_FUNCTIONS
 * @module dyYahooPipes
 *
 * @description
 * Object that contain list of functions to parse data of pipe's item received from Yahoo Pipes API.
 */
angular.module('dyYahooPipes').constant(
  'DY_YAHOO_PIPES_PARSE_FUNCTIONS',
  {
   /**
   * @ngdoc method
   * @name DY_YAHOO_PIPES_PARSE_FUNCTIONS#title
   * @module dyYahooPipes
   *
   * @description
   * Parse and return title of pipe's item.
   *
   * @param {object} item Response data for single pipe's item
   * @returns {string} Parsed title
   */
    title: function(item) {
      return item.title;
    },
   /**
   * @ngdoc method
   * @name DY_YAHOO_PIPES_PARSE_FUNCTIONS#description
   * @module dyYahooPipes
   *
   * @description
   * Parse and return description of pipe's item.
   *
   * @param {object} item Response data for single pipe's item
   * @returns {string} Parsed description
   */
    description: function(item) {
      return item.description
        .replace(/(<([^>]+)>)/ig, '')
        .replace(/(&[^;]+;)/ig, '')
        .replace('Read More', '');
    },
   /**
   * @ngdoc method
   * @name DY_YAHOO_PIPES_PARSE_FUNCTIONS#link
   * @module dyYahooPipes
   *
   * @description
   * Parse and return link of pipe's item.
   *
   * @param {object} item Response data for single pipe's item
   * @returns {string} Parsed link
   */
    link: function(item) {
      return item.link;
    },
   /**
   * @ngdoc method
   * @name DY_YAHOO_PIPES_PARSE_FUNCTIONS#imageUrl
   * @module dyYahooPipes
   *
   * @description
   * Parse and return image's url of pipe's item.
   *
   * @param {object} item Response data for single pipe's item
   * @returns {string} Parsed image's url
   */
    imageUrl: function(item) {
      var images = item['media:thumbnail'],
          firstImage = angular.isArray(images) ? images[0] : images;

      return firstImage.url;
    }
  }
);

/**
 * @ngdoc service
 * @name dyYahooPipesParser
 * @module dyYahooPipes
 * @requires DY_YAHOO_PIPES_PARSE_FUNCTIONS
 *
 * @description
 * The `dyYahooPipesParser` service is responsible for parsing response from Yahoo Pipes API to
 * plain objects that contains attributes specified in `DY_YAHOO_PIPES_PARSE_FUNCTIONS`.
 *
 * This service uses functions from `DY_YAHOO_PIPES_PARSE_FUNCTIONS` to make all parsing job.
 */
angular.module('dyYahooPipes').factory('dyYahooPipesParser', ['DY_YAHOO_PIPES_PARSE_FUNCTIONS', function(DY_YAHOO_PIPES_PARSE_FUNCTIONS) {
  return {
    /**
     * @ngdoc method
     * @name dyYahooPipesParser#parseItem
     *
     * @description
     * Parse one item of responce.
     *
     * @param {Object} item Item from response.
     * @return {Object} Parsed item
     */
    parseItem: function(item) {
      return Object.keys(DY_YAHOO_PIPES_PARSE_FUNCTIONS).reduce(function(result, key) {
        result[key] = DY_YAHOO_PIPES_PARSE_FUNCTIONS[key](item);
        return result;
      }, {});
    },

    /**
     * @ngdoc method
     * @name dyYahooPipesParser#parseResponseData
     *
     * @description
     * Parse data of Yahoo Pipes API response to array of items.
     *
     * @param {Object} responseData Response of Yahoo Pipes API.
     * @param {integer} count Number of items to parse
     * @return {Array} Array of parsed items
     */
    parseResponseData: function(responseData, count) {
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

/**
 * @ngdoc service
 * @name dyYahooPipesFetcher
 * @module dyYahooPipes
 *
 * @requires $http
 * @requires $q
 * @requires DY_YAHOO_PIPES_URL_PATTERN
 * @requires DY_YAHOO_PIPES_DEFAULT_COUNT
 * @requires dyYahooPipesParser
 *
 * @description
 * The `dyYahooPipesFetcher` service is responsible for fetching items from Yahoo Pipes API and
 * then parsing it by the `dyYahooPipesParser` service.
 */
angular.module('dyYahooPipes').factory('dyYahooPipesFetcher', ['$http', '$q', 'DY_YAHOO_PIPES_URL_PATTERN', 'DY_YAHOO_PIPES_DEFAULT_COUNT', 'dyYahooPipesParser', function($http, $q, DY_YAHOO_PIPES_URL_PATTERN, DY_YAHOO_PIPES_DEFAULT_COUNT, dyYahooPipesParser) {
  return {
    /**
     * @ngdoc method
     * @name dyYahooPipesFetcher#fetch
     *
     * @description
     * Fetch data from Yahoo Pipes API and parse by the `dyYahooPipesParser` service.
     *
     * @param {string} pipeId Id of a pipe to fetch.
     * @param {integer} count Number of items to fetch
     * @returns {promise} Promise that will be resolved by array of pipe's items.
     */
    fetch: function(pipeId, count) {
      var url = DY_YAHOO_PIPES_URL_PATTERN.replace('PIPE_ID', pipeId);
      return $http.get(url).then(function(response) {
        return dyYahooPipesParser.parseResponseData(response.data, count || DY_YAHOO_PIPES_DEFAULT_COUNT);
      });
    }
  };
}]);

/**
 * @ngdoc directive
 * @name dyYahooPipes
 * @module dyYahooPipes
 * @restrict E
 *
 * @description
 * The `dyYahooPipes` directive fetches Yahoo Pipes and display result as list of items.
 * Each item has `title`, `description`, `imageUrl` and `link`.
 *
 * When data is beeing loaded it displays loading message. Similar message is displayed when pipe is empty.
 * Also there are classes `is-loading` and `is-empty` on wrapper element that can be used to add specific
 * CSS styles to directive.
 *
 * The directive has ability to manage active item. When item is clicked it becomes active. Only one item
 * can be active at the same time. Active item has class `is-active` to change its CSS styles.
 *
 * All text can be changed by passing specific attributes to directive.
 *
 * @param {string} pipeId Id of Yahoo Pipe to show.
 * @param {integer} count Number of elements of pipe to show.
 * @param {string} required The control is considered valid only if value is entered.
 * @param {string} loadingText Text to show when pipe is beeing loaded.
 * @param {string} emptyText Text to show when pipe is empty.
 * @param {string} linkText Text of item's link.
 *
 * @example
    <example module="selectExample">
      <file name="index.html">
        <script>
        angular.module('selectExample', ['dyYahooPipes']);
        </script>

        <dy-yahoo-pipes pipe-id="IDwA0nTK2xGv8oU0JhOy0Q"></dy-yahoo-pipes>
      </file>
    </example>
 */
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
      count: '@'
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
