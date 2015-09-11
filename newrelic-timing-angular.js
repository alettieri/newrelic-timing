/*!
 * newrelic-timing v0.5.0 - Integrates Single Page Apps with NewRelic's Real User Monitoring
 * Copyright (c) 2015 Diogo Terror <diogo@uken.com>, pitr <pitr.vern@gmail.com> - https://github.com/uken/newrelic-timing
 * License: MIT
 */

(function(angular) {
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

  nrModule.run(['$rootScope', '$location', 'NewRelicTiming', function($rootScope, $location, NewRelicTiming) {
    var newrelicTiming = new NewRelicTiming();

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

})(window.angular);