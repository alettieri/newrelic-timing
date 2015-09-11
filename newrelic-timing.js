/*!
 * newrelic-timing v0.5.0 - Integrates Single Page Apps with NewRelic's Real User Monitoring
 * Copyright (c) 2015 Diogo Terror <diogo@uken.com>, pitr <pitr.vern@gmail.com> - https://github.com/uken/newrelic-timing
 * License: MIT
 */

(function(window, newrelic){
  window.NewrelicTiming = function() {
    this.marks = {};
    this.newrelic = newrelic;

    this.mark = function(name) {
      this.marks[name] = +new Date();
    };

    this.measure = function(markName, against) {
      var compareTime, referenceTime;

      if (against) {
        referenceTime = this.marks[against];
        compareTime = this.marks[markName];
      } else {
        referenceTime = this.marks[markName];
        compareTime = +new Date();
      }

      return compareTime - referenceTime;
    };

    this.sendNRBeacon = function(fragmentName) {
      if (!this.checkBeaconRequirements()) {
        return;
      }

      fragmentName || (fragmentName = window.location.hash.substring(1));

      var startTime = this.measure('domLoaded', 'navStart');
      var renderTime = this.measure('pageRendered', 'navStart');

      var trace = {
        name: fragmentName,
        start: startTime,
        end: renderTime
      };

      this.newrelic.addToTrace(trace);
    };

    this.checkBeaconRequirements = function() {
      if (!this.newrelic || !this.newrelic.addToTrace || typeof this.newrelic.addToTrace !== 'function') {
        return false;
      }
      return this.marks.navStart && this.marks.domLoaded && this.marks.pageRendered;
    };
  };
})(window, window.newrelic);