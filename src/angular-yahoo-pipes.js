angular.module('dyYahooPipes', []).directive('dyYahooPipes', function() {
  return {
    restrict: 'E',
    replace: true,
    template: '<pre>Yahoo Pipes!</pre>'
  };
});
