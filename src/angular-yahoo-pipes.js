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

angular.module('dyYahooPipes').factory('dyYahooPipesParser', function(DY_YAHOO_PIPES_PARSE_FUNCTIONS) {
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
});

angular.module('dyYahooPipes').factory('dyYahooPipesFetcher', function($http, $q, DY_YAHOO_PIPES_URL_PATTERN, DY_YAHOO_PIPES_DEFAULT_COUNT, dyYahooPipesParser) {
  return {
    fetch: function (pipeId, count) {
      var url = DY_YAHOO_PIPES_URL_PATTERN.replace('PIPE_ID', pipeId);
      return $http.jsonp(url).then(function(response) {
        return dyYahooPipesParser.parseResponseData(response.data, count || DY_YAHOO_PIPES_DEFAULT_COUNT);
      });
    }
  };
});

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
    controller: function($scope, dyYahooPipesFetcher) {
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
    }
  };
});
