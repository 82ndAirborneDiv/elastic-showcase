(function () {
  'use strict';

  angular
    .module('app.layout')
    .controller('ShellController', ShellController);

  ShellController.$inject = ['$rootScope', '$timeout', 'config', 'logger', '$cookies'];
  /* @ngInject */
  function ShellController($rootScope, $timeout, config, logger, $cookies) {

    var vm = this;
    vm.busyMessage = 'Please wait ...';

    $rootScope.isBusy = false;

    activate();

    function activate() {
      // logger.success(config.appTitle + ' loaded!', null);
    }

    function hideSplash() {
      //Force a 1 second delay so we can see the splash.
      $timeout(function () {
        $rootScope.showSplash = false;
      }, 1000);
    }
  }
})();
