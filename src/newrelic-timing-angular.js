(function(angular, NewrelicTiming) {
  if (typeof angular === 'undefined' || angular === null || typeof angular.module !== 'function') {
    return;
  }

  function NewRelicTimingFactory($window) {
    return $window.NewrelicTiming;
  }

  var nrModule = angular.module('newrelic-timing', []).factory('NewRelicTiming', ['$window', NewRelicTimingFactory]);

  if (typeof nrModule.run !== 'function') {
    return;
  }

  nrModule.run(['$rootScope', '$location', function($rootScope, $location) {
    var newrelicTiming = new NewrelicTiming();

    function changeStart(){
      newrelicTiming.mark('navStart');
    }
    function changeSuccess() {
      newrelicTiming.mark('domLoaded');
    }

    // ngRoute
    $rootScope.$on('$routeChangeStart', changeStart);
    $rootScope.$on('$routeChangeSuccess', changeSuccess);

    // ui-router
    $rootScope.$on('$stateChangeStart', changeStart);
    $rootScope.$on('$stateChangeSuccess', changeSuccess);

    $rootScope.$on('$viewContentLoaded', function() {
      newrelicTiming.mark('pageRendered');
      newrelicTiming.sendNRBeacon($location.path());
    });
  }]);

})(window.angular, window.NewrelicTiming);
