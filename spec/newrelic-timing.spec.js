(function(global) {

  describe('NewrelicTiming', function(){

    var newrelicTiming;

    beforeEach(function() {
      newrelicTiming  = new global.NewrelicTiming();
    });

    describe('mark', function() {

      it('marks an event', function() {
        newrelicTiming.mark('hello');

        expect(typeof newrelicTiming.marks.hello).toBe('number');

        expect(newrelicTiming.marks.hello).toBeLessThan(+new Date()+1);
        expect(newrelicTiming.marks.hello).toBeGreaterThan(+new Date()-10);
      });
    });

    describe('measure', function() {

      it('returns difference between two marks', function() {
        newrelicTiming.marks.a = 1;
        newrelicTiming.marks.b = 100;

        expect(newrelicTiming.measure('b', 'a')).toBe(99);
      });

    });

    describe('checkBeaconRequirements', function() {
      beforeEach(function() {
        newrelicTiming.marks = {
          'navStart': 5,
          'domLoaded': 9,
          'pageRendered': 20
        };

        newrelicTiming.newrelic = {
          addToTrace: function() {
          }
        };
      });

      it('returns true if everything is setup', function() {
        expect(newrelicTiming.checkBeaconRequirements()).toBeTruthy();
      });

      it('returns false if newrelic is not defined', function() {
        newrelicTiming.newrelic = null;

        expect(newrelicTiming.checkBeaconRequirements()).toBeFalsy();
      });

      it('returns false if newrelic.addToTrace is not defined', function() {
        newrelicTiming.newrelic = {};

        expect(newrelicTiming.checkBeaconRequirements()).toBeFalsy();
      });

      it('returns false if newrelic.addToTrace is not a function', function() {
        newrelicTiming.newrelic = {
          addToTrace: 42
        };

        expect(newrelicTiming.checkBeaconRequirements()).toBeFalsy();
      });

      it('returns false if proper marks are not set', function() {
        newrelicTiming.marks = {};

        expect(newrelicTiming.checkBeaconRequirements()).toBeFalsy();

        newrelicTiming.marks = {
          'navStart': 5,
          'pageRendered': 20
        };

        expect(newrelicTiming.checkBeaconRequirements()).toBeFalsy();
      });

    });

    describe('sendNRBeacon', function() {

      var results = null;

      beforeEach(function() {
        newrelicTiming.marks.navStart = 5;
        newrelicTiming.marks.domLoaded = 9;
        newrelicTiming.marks.pageRendered = 20;

        newrelicTiming.newrelic = {
          addToTrace: function() {
            results = [].slice.call(arguments, 0);
          }
        };

        newrelicTiming.checkBeaconRequirements = function() {
          return true;
        };
      });

      it('sends specific markings to newrelic', function() {
        newrelicTiming.sendNRBeacon('page1');

        expect(results).toEqual( jasmine.objectContaining([{ name : 'page1', start: 4, end: 15}]));
      });

      it('handles hash in fragments', function() {
        window.location.hash = '#page2/page3/';
        newrelicTiming.sendNRBeacon();

        expect(results).toEqual(jasmine.objectContaining([{ name: 'page2/page3/', start: 4, end: 15}]));
      });
    });
  });

}(this));
